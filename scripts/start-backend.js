// const { spawn } = require("child_process");
// const path = require("path");

// const pythonPath = process.platform === "win32"
//   ? path.join(__dirname, "../backend/.venv/Scripts/python.exe")
//   : path.join(__dirname, "../backend/.venv/bin/python");

// const backend = spawn(pythonPath, ["flask_app.py"], {
//   cwd: path.join(__dirname, "../backend"),
//   stdio: "inherit",
// });

// backend.on("close", (code) => {
//   console.log(`Backend exited with code ${code}`);
// });

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const backendDir = path.join(__dirname, "../backend");

// Windows 與 mac/Linux 虛擬環境路徑
const venvPythonWin = path.join(backendDir, ".venv", "Scripts", "python.exe");
const venvPythonUnix = path.join(backendDir, ".venv", "bin", "python");

// 根據系統決定預設的 .venv Python 路徑
const venvPython = process.platform === "win32" ? venvPythonWin : venvPythonUnix;

let pythonPath;

// ✅ 判斷 .venv 是否存在
if (fs.existsSync(venvPython)) {
  pythonPath = venvPython;
  console.log(`✅ 使用虛擬環境的 Python: ${pythonPath}`);
} else {
  // ❌ 沒有虛擬環境 → 改用系統 Python
  pythonPath = process.platform === "win32" ? "python" : "python3";
  console.log(`⚠️ 找不到 .venv，改用系統 Python: ${pythonPath}`);
}

// 啟動 Flask
const backend = spawn(pythonPath, ["flask_app.py"], {
  cwd: backendDir,
  stdio: "inherit",
});

backend.on("error", (err) => {
  console.error("❌ 啟動 Flask 失敗:", err);
});

backend.on("close", (code) => {
  console.log(`🛑 Flask Backend 結束，代碼 ${code}`);
});
