# 🧠 Inhouse Dashboard — Fullstack (React + Flask)

This project integrates a **React (Vite)** frontend with a **Flask** backend.  
It provides real-time strategy monitoring and trading analytics for TWSE and USA models.
It uses Echart for visualization.

---

## 📁 Project Structure

| Path                          | Description                                         |
|-------------------------------|-----------------------------------------------------|
| `frontend/`                   | React + Vite frontend                              |
| `frontend/src/`               | Frontend source code                               |
| `frontend/vite.config.ts`     | Vite configuration file                            |
| `backend/`                    | Flask backend                                      |
| `backend/flask_app.py`        | Main Flask server entry point                      |
| `backend/helper.py`          | Helper functions / data processing logic           |
| `package.json`               | Uses `concurrently` to run both frontend and backend |
| `README.md`                  | Project documentation                              |
| `.gitignore`                 | Git ignore configuration                           |

---



![Dashboard Preview](./png/png1.png)
![Dashboard Preview](./png/png2.png)
![Dashboard Preview](./png/png3.png)
---

## 🚀 Project Explanation
This project primarily supports backtesting simulations and paper trading monitoring.
It retrieves daily trading data stored in AWS S3 through APIs, ensuring that the web application focuses solely on monitoring and visualization without performing direct trading or computation tasks.

The backend adopts a CI/CD-driven architecture, where pricing calculations and strategy computations are fully decoupled from the main service.
All data updates and validations are handled by a scheduler and CI/CD pipeline, ensuring that the retrieval process remains efficient, consistent, and reliable.

This design enhances modularity, security, and performance, making the system highly suitable for daily trading supervision and quantitative strategy development environments.

For testing the S3 key (download daily Log file), please email: lukerspace@gmail.com 

### Clone the repository




```bash
1️⃣ download
Download from GitHub

2️⃣ Install dependencies by npm install
npm install


3️⃣ Start the development servers
npm run dev


Start the Flask backend on port 8000.
Start the Vite frontend on port 8081.
Enable CORS (flask_cors) so the frontend can communicate with the backend seamlessly.


Service Endpoints
Frontend (React Dashboard): http://localhost:8081
Middleware Service: http://localhost:8080 — handles S3 operations and triggers data reloads
Backend API: http://localhost:8000 — core data processing and REST endpoints

📝 Prerequisites

Before getting started, ensure the following dependencies are installed on your system:
Python ≥ 3.10
Node.js ≥ 18

If any required Python packages are missing, install them with:
pip install flask flask-cors pandas numpy

Alternatively, you can install all project dependencies (including model-related packages) using:
pip install -r requirements.txt
To build and deploy the frontend for production:

cd frontend
npm run build


🧰 Tech Stack

Frontend:
React
Vite
Tailwind CSS
ShadCN UI
Echart

Backend:
Python
Flask
flask-cors
Pandas
Numpy

Development:
npm
concurrently
GitLab CI/CD


