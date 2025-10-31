import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { FullConfig } from "@playwright/test";

let mongoContainer: StartedTestContainer | null = null;
let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

// 🔍 Determine app path (local vs CI)
const getAppPath = () => {
  const localPath = path.resolve(__dirname, "../../confac");
  const ciPath = "/confac";

  if (fs.existsSync(path.join(localPath, "backend"))) {
    console.log(`🧩 Using local confac path: ${localPath}`);
    return localPath;
  }

  console.log(`🧩 Using CI confac path: ${ciPath}`);
  return ciPath;
};

// 🧠 Helper to spawn npm commands cross-platform
function runNpmStart(cwd: string, extraEnv: Record<string, string> = {}) {
  const nodePath = process.execPath; // the exact node binary in this environment
  const npmCli = require.resolve("npm/bin/npm-cli.js");
  console.log(`🧠 Running "npm start" in ${cwd}`);

  const child = spawn(nodePath, [npmCli, "start"], {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...extraEnv },
  });

  const logFile = path.join(process.cwd(), `${path.basename(cwd)}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: "a" });
  child.stdout?.pipe(logStream);
  child.stderr?.pipe(logStream);

  child.on("error", (err) => {
    console.error(`❌ Failed to start npm in ${cwd}:`, err);
  });

  return child;
}


async function globalSetup(config: FullConfig) {
  const appPath = getAppPath();

  // --- Mongo configuration ---
  const mongoUser = process.env.MONGO_USERNAME || "admin";
  const mongoPass = process.env.MONGO_PASSWORD || "pwd";
  const mongoDb = process.env.MONGO_DB || "confac";

  console.log("🧱 Starting MongoDB in Testcontainers...");
  mongoContainer = await new GenericContainer("mongo:latest")
    .withExposedPorts(27017)
    .withEnvironment({
      MONGO_INITDB_DATABASE: mongoDb,
      MONGO_INITDB_ROOT_USERNAME: mongoUser,
      MONGO_INITDB_ROOT_PASSWORD: mongoPass,
    })
    .withStartupTimeout(120_000)
    .withWaitStrategy(Wait.forLogMessage("Waiting for connections"))
    .start();

  const mappedPort = mongoContainer.getMappedPort(27017);
  const mongoUrl = `mongodb://${mongoUser}:${mongoPass}@${mongoContainer.getHost()}:${mappedPort}/${mongoDb}?authSource=admin`;

  process.env.MONGODB_URI = mongoUrl;
  console.log(`✅ MongoDB container started at ${mongoUrl}`);

  // --- Start backend ---
  console.log("🚀 Starting backend...");
  backendProcess = runNpmStart(path.join(appPath, "backend"), {
    MONGODB_URI: mongoUrl,
    PORT: "9000",
  });

  // --- Start frontend ---
  console.log("🚀 Starting frontend...");
  frontendProcess = runNpmStart(path.join(appPath, "frontend"), {
    PORT: "3000",
    BACKEND_URL: "http://localhost:9000",
  });

  // --- Wait for both apps to be ready ---
  console.log("⏳ Waiting for services to be ready...");
  await new Promise((resolve) => setTimeout(resolve, 15_000));

  // --- Save runtime info ---
  fs.writeFileSync(
    path.resolve(__dirname, "runtime.json"),
    JSON.stringify({
      mongoId: mongoContainer?.getId() ?? null,
      backendPid: backendProcess?.pid ?? null,
      frontendPid: frontendProcess?.pid ?? null,
    })
  );

  console.log("✅ Test environment ready.");
}

export default globalSetup;
