import pandas as pd
import numpy as np
import os
import datetime
import json
import boto3
import logging
import sys

def file_mod_time(path):
    try:
        return os.path.getmtime(path)
    except FileNotFoundError:
        return 0

def download_data_from_s3():
    print_identity()
    
    s3 = boto3.client("s3")
    bucket = "your-bucket-name"
    model_paths = ["usa_model1", "usa_model2", "twse_model1"]

    for model in model_paths:
        prefix = f"data/{model}/"
        os.makedirs(prefix, exist_ok=True)
        for file in [
            "OrderBookOutput.xlsx",
            "PendingOrdersOutput.xlsx",
            "TradeBookOutput.xlsx",
            "EquityCurvePlot.json"
        ]:
            s3.download_file(bucket, f"{prefix}{file}", f"{prefix}{file}")
            print(f"✅ Downloaded {file} for {model}")
            
class S3Manager:
    def __init__(self, access_key: str, secret_key: str):
        """
        初始化 AWS Session 並建立 S3 與 STS 客戶端。
        """
        try:
            self.session = boto3.Session(
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
            )
            self.s3 = self.session.client("s3")
            self.sts = self.session.client("sts")
            logging.info("✅ AWS Session 建立成功。")
        except Exception as e:
            logging.error(f"❌ 建立 AWS Session 失敗：{e}")
            sys.exit(1)

    def print_identity(self):
        """
        取得並顯示目前的 AWS 身份。
        """
        try:
            identity = self.sts.get_caller_identity()
            logging.info("AWS 身份識別成功：")
            logging.info(f"  ➤ Account ID: {identity['Account']}")
            logging.info(f"  ➤ User/Role ARN: {identity['Arn']}")
            logging.info(f"  ➤ User ID: {identity['UserId']}")
        except Exception as e:
            logging.error(f"❌ 無法取得身分識別：{e}")
            sys.exit(1)

    def download_file(self, bucket: str, key: str, local_path: str):
        """
        從 S3 下載指定檔案到本地端。
        """
        try:
            self.s3.head_object(Bucket=bucket, Key=key)
            logging.info("✅ 檔案存在，開始下載...")

            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            with open(local_path, "wb") as f:
                self.s3.download_fileobj(bucket, key, f)

            logging.info(f"✅ 已下載至本地：{local_path}")
        except Exception as e:
            logging.error(f"❌ 無法下載檔案：{e}")
            sys.exit(1)
    
class PageCache:
    def __init__(self, name, files):
        self.name = name
        self.files = files
        self.last_mtime = 0
        self.instance = None

    def get_instance(self):
        current_mtime = max(file_mod_time(f) for f in self.files)
        if self.instance is None or current_mtime > self.last_mtime:
            # print(f"🔄 Reloading {self.name} — files updated")
            self.instance = DetailPage(*self.files)
            self.last_mtime = current_mtime
        return self.instance

class DetailPage:
    def __init__(self, filled_orders_file,
                 pending_orders_file,
                 tradebook_file,
                 equity_series_file=None):
        self.filled_orders_file = filled_orders_file
        self.pending_orders_file = pending_orders_file
        self.tradebook_file = tradebook_file
        self.equity_series_file = equity_series_file
        
        self.process()
    
    def process(self):
        ### Datetime ###
        self.datetime = datetime.datetime.fromtimestamp(os.path.getmtime(self.tradebook_file))

        ### Filled Orders ###
        order_book = pd.read_excel(self.filled_orders_file)
        # Example filter: fix date as in your original snippet
        self.filled_orders = order_book[order_book["Date"] == pd.to_datetime("2025-08-01").strftime('%Y-%m-%d')]
        self.filled_orders = self.filled_orders.round({"Price": 2, "Fee": 2})
        self.filled_orders.replace({np.nan: None}, inplace=True)

        self.filled_orders.rename(columns={
            "Date": "date",
            "Ticker": "ticker",
            "Action": "action",
            "Quantity": "quantity",
            "Price": "price",
            "Fee": "fee",
            "Comment": "comment"
        }, inplace=True)
        
        
        ### Pending Orders ###
        self.pending_orders = pd.read_excel(self.pending_orders_file)
        if not self.pending_orders.empty:
            self.pending_orders = self.pending_orders.drop(columns=["execute_ma"])
            self.pending_orders.replace({np.nan: None}, inplace=True)

            self.pending_orders.rename(columns={
                "submited_time": "submittedTime",
                "ticker": "ticker",
                "action": "action",
                "quantity": "quantity",
                "order_type": "orderType",
                "executePrice": "executePrice",
                "Comment": "comment"
            }, inplace=True)
        
        
        ### Tradebook ###
        self.trade_book = pd.read_excel(self.tradebook_file)
        if len(self.trade_book) == 0:
            self.trade_book = pd.DataFrame(columns=["Ticker", "Share", "Enter Date", "Enter Price",
                                               "Exit Date", "Exit Price", "Exit Reason",
                                               "Today Price", "Profit %",
                                               "Max Gain %", "Max Loss %", "Period Max Gain %", "Days"])
        else:
            self.trade_book["Direction"] = self.trade_book["Share"].apply(lambda x: "Long" if x > 0 else "Short")
            self.trade_book = self.trade_book[["Ticker", "Share", "Enter Date", "Enter Price",
                                     "Exit Date", "Exit Price", "Exit Reason", "Today Price", "Profit %",
                                     "Max Gain %", "Max Loss %", "Days"]]
            self.trade_book = self.trade_book.round({
                "Enter Price": 2, "Exit Price": 2, "Today Price": 2,
                "Profit %": 2, "Max Gain %": 2, "Max Loss %": 2
            })

        self.trade_book = self.trade_book.sort_values(by="Profit %", ascending=False)
        self.trade_book.replace({np.nan: None}, inplace=True)        
        
        ### Status ###
        if len(self.trade_book) == 0:
            total_pnl = 0.0
            total_return = 0.0
            active_pos = 0.0
            win_rate = 0.0
        else:
            trade_book = self.trade_book.copy()
            in_position_row = trade_book["Exit Date"].isna()
            trade_book.loc[in_position_row, "Exit Price"] = trade_book.loc[in_position_row, "Today Price"]
            total_pnl = ((trade_book["Exit Price"] - trade_book["Enter Price"]) * trade_book["Share"]).sum()
            total_return = round(total_pnl / abs(trade_book["Enter Price"] * trade_book["Share"]).sum() * 100, 2)
            active_pos = int(trade_book["Exit Date"].isna().sum())
            win_rate = round((trade_book["Profit %"] > 0).sum() / len(trade_book) * 100, 2)
            
        self.status = {
            "totalPnl": total_pnl,
            "totalReturn": total_return,
            "activePos": active_pos,
            "winRate": win_rate 
        }
        
        
        ### Equity Series ###
        self.equity_series_dict = pd.read_excel(self.equity_series_file, sheet_name=None)
    
    def get(self):
        """Return combined model data."""
        return {
            "datetime": self.datetime,
            "status": self.get_status(),
            "filledOrders": self.get_filled_orders(),
            "pendingOrders": self.get_pending_orders(),
            "tradebook": self.get_tradebook(),
            "equitySeries": self.get_equity_series()
        }
        
    def get_status(self):
        return self.status
    
    def get_filled_orders(self):
        if self.filled_orders.empty:
            return []
        return self.filled_orders.to_dict(orient="records")

    def get_pending_orders(self):
        if self.pending_orders.empty:
            return []
        return self.pending_orders.to_dict(orient="records")

    def get_tradebook(self):
        if self.trade_book.empty:
            return []
        
        output = self.trade_book[["Ticker", "Share", "Enter Date", "Enter Price",
                                  "Exit Date", "Exit Price", "Exit Reason", "Today Price", "Profit %",
                                  "Max Gain %", "Max Loss %", "Days"]].copy()
        output.rename(columns={
            "Ticker": "ticker",
            "Share": "share",
            "Enter Date": "enterDate",
            "Enter Price": "enterPrice",
            "Exit Date": "exitDate",
            "Exit Price": "exitPrice",
            "Exit Reason": "exitReason",
            "Today Price": "todayPrice",
            "Profit %": "profitPercent",
            "Max Gain %": "maxGainPercent",
            "Max Loss %": "maxLossPercent",
            "Days": "days"
            }, inplace=True)
        
        return output.to_dict(orient="records")
    
    def get_equity_series(self):
        output = []
        
        for sheet_name, df in self.equity_series_dict.items():
            df.columns = df.columns.astype(str)
        
            if df.empty:
                return []
        
            one_series = []
            for _, row in df.iterrows():
                ticker = row['Ticker']
                # create list of {"date": ..., "value": ...}
                data_list = [{"date": col, "value": row[col]} 
                            for col in df.columns if col != 'Ticker']
                one_series.append({"Ticker": ticker, "data": data_list})
            
            output.append({"Title": sheet_name, "series": one_series})   
        return output