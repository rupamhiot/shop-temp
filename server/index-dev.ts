import { spawn } from "child_process";

// Launch Python FastAPI backend
const backend = spawn("python", ["server/main.py"], {
  stdio: "inherit",
  shell: true,
});

backend.on("error", (error) => {
  console.error("Failed to start Python backend:", error);
  process.exit(1);
});

backend.on("exit", (code) => {
  console.log("Backend exited with code:", code);
  process.exit(code || 0);
});
