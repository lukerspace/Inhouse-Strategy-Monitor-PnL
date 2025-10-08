@REM Download USA Model1 files
aws s3 cp s3://dashboard-global-backend-prod/usa_model1/EquitySeriesOutput.xlsx ./data/usa_model1/EquitySeriesOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/usa_model1/OrderBookOutput.xlsx ./data/usa_model1/OrderBookOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/usa_model1/PendingOrdersOutput.xlsx ./data/usa_model1/PendingOrdersOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/usa_model1/TradeBookOutput.xlsx ./data/usa_model1/TradeBookOutput.xlsx

@REM Download USA Model1 files
aws s3 cp s3://dashboard-global-backend-prod/usa_model2/EquitySeriesOutput.xlsx ./data/usa_model2/EquitySeriesOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/usa_model2/OrderBookOutput.xlsx ./data/usa_model2/OrderBookOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/usa_model2/PendingOrdersOutput.xlsx ./data/usa_model2/PendingOrdersOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/usa_model2/TradeBookOutput.xlsx ./data/usa_model2/TradeBookOutput.xlsx

@REM Download TWSE Model1 files
aws s3 cp s3://dashboard-global-backend-prod/twse_model1/EquitySeriesOutput.xlsx ./data/twse_model1/EquitySeriesOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/twse_model1/OrderBookOutput.xlsx ./data/twse_model1/OrderBookOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/twse_model1/PendingOrdersOutput.xlsx ./data/twse_model1/PendingOrdersOutput.xlsx
aws s3 cp s3://dashboard-global-backend-prod/twse_model1/TradeBookOutput.xlsx ./data/twse_model1/TradeBookOutput.xlsx
