from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from helper import PageCache, DetailPage, S3Manager
import config 
import os


app = Flask(__name__)

# Allow React frontend to talk to Flask

# CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})
CORS(app, resources={r"/*": {"origins": "*"}})


usa_model1_cache = PageCache(
    "usa_model1",[
    "data/usa_model1/OrderBookOutput.xlsx",
    "data/usa_model1/PendingOrdersOutput.xlsx",
    "data/usa_model1/TradeBookOutput.xlsx",
    "data/usa_model1/EquitySeriesOutput.xlsx",
])

usa_model2_cache = PageCache(
    "usa_model2", [
    "data/usa_model2/OrderBookOutput.xlsx",
    "data/usa_model2/PendingOrdersOutput.xlsx",
    "data/usa_model2/TradeBookOutput.xlsx",
    "data/usa_model2/EquitySeriesOutput.xlsx"
])

twse_model1_cache = PageCache(
    "twse_model1",[
    "data/twse_model1/OrderBookOutput.xlsx",
    "data/twse_model1/PendingOrdersOutput.xlsx",
    "data/twse_model1/TradeBookOutput.xlsx",
    "data/twse_model1/EquitySeriesOutput.xlsx",
])


@app.route("/usa-model1", methods=["GET"])
def get_usa_model1():
    page = usa_model1_cache.get_instance()
    return page.get()


@app.route("/usa-model2", methods=["GET"])
def get_usa_model2():
    page = usa_model2_cache.get_instance()
    return page.get()


@app.route("/twse-model1", methods=["GET"])
def get_twse_model1():
    page = twse_model1_cache.get_instance()
    return page.get()


@app.route("/", methods=["GET"])
def index():
    return {"status": "ok"}


# RELOAD_SECRET = os.getenv("RELOAD_SECRET")

@app.route("/reload", methods=["POST"])
def reload_data():
    # auth = request.headers.get("X-Reload-Token")
    # if auth != RELOAD_SECRET:
        # return jsonify({"error": "Unauthorized"}), 401
        
    bucket = "dashboard-global-backend-prod"
    model_paths = ["usa_model1", "usa_model2", "twse_model1"]

    for model in model_paths:
        source_prefix = f"{model}/"
        dest_prefix = f"data/{model}/"
        os.makedirs(dest_prefix, exist_ok=True)
        for file in [
            "OrderBookOutput.xlsx",
            "PendingOrdersOutput.xlsx",
            "TradeBookOutput.xlsx",
            "EquitySeriesOutput.xlsx"
        ]:
            s3_manager.download_file(bucket, f"{source_prefix}{file}", f"{dest_prefix}{file}")
            print(f"✅ Downloaded {file} for {model}")
    
    return jsonify({"status": "reloaded"}), 200


if __name__ == "__main__":
    s3_manager = S3Manager(
        access_key=config.ACCESS_KEY,
        secret_key=config.SECRET_KEY,
    )
    
    app.run(host="0.0.0.0", port=8000, debug=True)
