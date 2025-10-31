import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { FullConfig } from "@playwright/test";

let mongoContainer: StartedTestContainer | null = null;
let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

// Detect app path (local vs CI)
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

// Run `npm start` in a cross-platform way (works in CI)
function runNpmStart(cwd: string, extraEnv: Record<string, string> = {}) {
  const nodePath = process.execPath; // this Node binary always exists
  const npmCli = path.join(path.dirname(nodePath), "../lib/node_modules/npm/bin/npm-cli.js");

  console.log(`🧠 Running "node ${npmCli} start" in ${cwd}`);

  const child = spawn(nodePath, [npmCli, "start"], {
    cwd,
    env: { ...process.env, ...extraEnv },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout?.on("data", (d) => process.stdout.write(`[${path.basename(cwd)}] ${d}`));
  child.stderr?.on("data", (d) => process.stderr.write(`[${path.basename(cwd)}:ERR] ${d}`));

  child.on("error", (err) => {
    console.error(`❌ Failed to start npm in ${cwd}:`, err);
  });

  return child;
}

async function globalSetup(config: FullConfig) {
  const appPath = getAppPath();

  try {
    // Start Mongo
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

    // Start backend & frontend
    console.log("🚀 Starting backend...");
    backendProcess = runNpmStart(path.join(appPath, "backend"), {
      MONGODB_URI: mongoUrl,
      PORT: "9000",
    });

    console.log("🚀 Starting frontend...");
    frontendProcess = runNpmStart(path.join(appPath, "frontend"), {
      PORT: "3000",
      BACKEND_URL: "http://localhost:9000",
    });

    console.log("⏳ Waiting for services to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 20_000));

    // Record runtime
    fs.writeFileSync(
      path.resolve(__dirname, "runtime.json"),
      JSON.stringify({
        mongoId: mongoContainer?.getId() ?? null,
        backendPid: backendProcess?.pid ?? null,
        frontendPid: frontendProcess?.pid ?? null,
      })
    );

    console.log("✅ Test environment ready.");
  } catch (err) {
    console.error("❌ Setup failed:", err);
    if (mongoContainer) {
      console.log("🧹 Cleaning up Mongo container...");
      await mongoContainer.stop();
    }
    process.exit(1);
  }
}

export default globalSetup;
