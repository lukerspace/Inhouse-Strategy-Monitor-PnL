import os
import requests

def lambda_handler():
    # reload_token = os.environ["RELOAD_SECRET"]
    resp = requests.post(
        "http://127.0.0.1:8000/reload",
        # headers={"X-Reload-Token": reload_token}
    )
    print(resp.json())
    
lambda_handler()