# Infra-Monitor-Backend-Test



## Getting started
Follow these steps:

```sh
# Step 1: Create and open Python virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Step 2: Install Python modules
pip install -r requirements.txt

# Step 3: Run FastAPI
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Step 4: Test API
curl http://localhost:8000/usa-model1