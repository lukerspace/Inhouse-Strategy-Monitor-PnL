from fastapi import FastAPI
import boto3, json
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI()

# Allow React frontend to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # allow all headers
)



@app.get("/usa-model1")
def get_usa_model1():
    return {
        "message": "Hello World from FastAPI",
        "filled_orders": get_filled_orders(),
        "pending_orders": get_pending_orders(),
        "tradebook": get_tradebook()
    }
    
def get_filled_orders():
    order_book = pd.read_excel("OrderBookOutput.xlsx")
    # filled_orders = order_book[order_book["Date"] == pd.to_datetime("today").strftime('%Y-%m-%d')]
    filled_orders = order_book[order_book["Date"] == pd.to_datetime("2025-08-01").strftime('%Y-%m-%d')]
    filled_orders = filled_orders.round({"Price": 2, "Fee": 2})
    filled_orders.replace({np.nan: None}, inplace=True)
    
    filled_orders.rename(columns={
        "Date": "date",
        "Ticker": "ticker",
        "Action": "action",
        "Quantity": "quantity",
        "Price": "price",
        "Fee": "fee",
        "Comment": "comment"
        }, inplace=True)
    
    return filled_orders.to_dict(orient='records')

def get_pending_orders():
    pending_orders = pd.read_excel("PendingOrdersOutput.xlsx")
    if pending_orders.empty:
        return []

    pending_orders = pending_orders.drop(columns=["execute_ma"])
    pending_orders.replace({np.nan: None}, inplace=True)
    
    pending_orders.rename(columns={
        "submited_time": "submittedTime",
        "ticker": "ticker",
        "action": "action",
        "quantity": "quantity",
        "order_type": "orderType",
        "executePrice": "executePrice",
        "Comment": "comment"
        }, inplace=True)
    return pending_orders.to_dict(orient='records')

def get_tradebook():
    trade_book = pd.read_excel("TradeBookOutput.xlsx")
    if len(trade_book) == 0:
        trade_book = pd.DataFrame(columns=["Ticker", "Enter Date", "Enter Price", 
                                                "Exit Date", "Exit Price", "Exit Reason", 
                                                "Today Price", "Profit %",
                                                "Max Gain %", "Max Loss %", "Period Max Gain %", "Days"])
    else:
        trade_book["Direction"] = trade_book["Share"].apply(lambda x: "Long" if x > 0 else "Short")
        trade_book = trade_book[["Ticker", "Enter Date", "Enter Price", 
                                "Exit Date", "Exit Price", "Exit Reason", "Today Price", "Profit %", 
                                "Max Gain %", "Max Loss %", "Days"]]
        trade_book = trade_book.round({"Enter Price": 2, "Exit Price": 2, "Today Price": 2, "Profit %": 2, "Max Gain %": 2, "Max Loss %": 2})
    trade_book = trade_book.sort_values(by="Profit %", ascending=False)
    trade_book.replace({np.nan: None}, inplace=True)
    
    trade_book.rename(columns={
        "Ticker": "ticker",
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
    
    return trade_book.to_dict(orient='records')
    
    
# trade_book = pd.read_excel("TradeBookOutput.xlsx")
# if len(trade_book) == 0:
#     trade_book = pd.DataFrame(columns=["Ticker", "Enter Date", "Enter Price", 
#                                             "Exit Date", "Exit Price", "Exit Reason", 
#                                             "Today Price", "Profit %",
#                                             "Max Gain %", "Max Loss %", "Period Max Gain %", "Days"])
# else:
#     trade_book["Direction"] = trade_book["Share"].apply(lambda x: "Long" if x > 0 else "Short")
#     trade_book = trade_book[["Ticker", "Enter Date", "Enter Price", 
#                             "Exit Date", "Exit Price", "Exit Reason", "Today Price", "Profit %", 
#                             "Max Gain %", "Max Loss %", "Days"]]
#     trade_book = trade_book.round({"Enter Price": 2, "Exit Price": 2, "Today Price": 2, "Profit %": 2, "Max Gain %": 2, "Max Loss %": 2})
# trade_book = trade_book.sort_values(by="Profit %", ascending=False)
# # trade_book = trade_book.set_index("Ticker")

# trade_book.rename(columns={
#     "Enter Date": "enterDate",
#     "Enter Price": "enterPrice",
#     "Exit Date": "exitDate",
#     "Exit Price": "exitPrice",
#     "Exit Reason": "exitReason",
#     "Today Price": "todayPrice",
#     "Profit %": "profitPercent",
#     "Max Gain %": "maxGainPercent",
#     "Max Loss %": "maxLossPercent",
#     "Days": "days"
#     }, inplace=True)
    
# print({"tradebook": trade_book.iloc[:2].to_dict(orient='records')})