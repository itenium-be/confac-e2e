import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export default async function globalTeardown() {
  const runtimePath = path.resolve(__dirname, "runtime.json");
  if (!fs.existsSync(runtimePath)) return;

  const { mongoId, backendPid, frontendPid } = JSON.parse(
    fs.readFileSync(runtimePath, "utf-8")
  );

  console.log("🧹 Cleaning up test environment...");

  try {
    if (mongoId) {
      console.log(`Stopping Mongo container ${mongoId}`);
      execSync(`docker stop ${mongoId}`, { stdio: "inherit" });
    }
    if (backendPid) process.kill(backendPid);
    if (frontendPid) process.kill(frontendPid);
  } catch (err) {
    console.warn("⚠️ Error during teardown:", err);
  }

  fs.unlinkSync(runtimePath);
  console.log("✅ Teardown complete.");
}
