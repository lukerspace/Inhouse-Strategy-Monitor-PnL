# 🧠 Inhouse Dashboard — Fullstack (React + Flask)

This project integrates a **React (Vite)** frontend with a **Flask** backend.  
It provides real-time strategy monitoring and trading analytics for TWSE and USA models.
It uses Echart for visualization.

# 📁  Project URL
https://kicksvc.online

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
All data updates and validations are handled by a scheduler and CI/CD pipeline, ensuring that the retrieval process remains efficient, consistent, and reliable.This design enhances modularity, security, and performance, making the system highly suitable for daily trading supervision and quantitative strategy development environments.


---


## 🧰 Tech Stack

| Category | Technologies / Tools |
|-----------|----------------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) ![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-black?logo=shadcnui) ![ECharts](https://img.shields.io/badge/ECharts-AA344D?logo=apacheecharts&logoColor=white) |
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white) ![Flask-CORS](https://img.shields.io/badge/Flask--CORS-lightgrey) ![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white) |
| **Development / DevOps** | ![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white) ![concurrently](https://img.shields.io/badge/concurrently-grey) ![GitLab CI/CD](https://img.shields.io/badge/GitLab_CI/CD-FC6D26?logo=gitlab&logoColor=white) |

---

## 🚀 How to Start

### 1️⃣ Download
Download from GitHub

### 2️⃣ Install dependencies by npm install
#### Install backend dependencies
cd ./
npm install

#### Install frontend dependencies
cd ./frontend
npm install

#### Install backend dependencies
cd ./backend
pip install -r requirements.txt


### 3️⃣ Start the development servers
#### Run Dev
cd ./
npm run dev

Start the Flask backend on port 8000.

Start the Vite frontend on port 8081.

Enable CORS (flask_cors) so the frontend can communicate with the backend seamlessly.
Service Endpoints

Frontend (React Dashboard): http://localhost:8081

Middleware Service: http://localhost:8080 — handles S3 operations and triggers data reloads

Backend API: http://localhost:8000 — core data processing and REST endpoints


---

```bash
📝 Prerequisites

Before getting started, ensure the following dependencies are installed on your system:
Python ≥ 3.10
Node.js ≥ 18
For testing the S3 key (download daily Log file), please email: lukerspace@gmail.com 


