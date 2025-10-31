import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { ChildProcess, spawn } from "child_process";
import path from "path";
import fs from "fs";
import { FullConfig } from "@playwright/test";
import os from "os";

let mongoContainer: StartedTestContainer | null = null;
let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

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

const isWindows = os.platform() === "win32";

async function globalSetup(config: FullConfig) {
  const appPath = getAppPath();

  // --- Mongo configuration ---
  const mongoPort = process.env.MONGO_PORT || "27017";
  const mongoUser = process.env.MONGO_USERNAME || "admin";
  const mongoPass = process.env.MONGO_PASSWORD || "pwd";
  const mongoDb = process.env.MONGO_DB || "confac";

  let mongoUrl: string;
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
  mongoUrl = `mongodb://${mongoUser}:${mongoPass}@${mongoContainer.getHost()}:${mappedPort}/${mongoDb}?authSource=admin`;

  process.env.MONGO_HOST = mongoContainer.getHost();
  process.env.MONGO_PORT = mappedPort.toString();
  process.env.MONGODB_URI = mongoUrl;

  console.log(`✅ MongoDB container started at ${mongoUrl}`);

  // --- Start backend ---
  console.log("🚀 Starting backend...");
  backendProcess = spawn("npm", ["start"], {
    cwd: path.join(appPath, "backend"),
    stdio: ["ignore", "pipe", "pipe"],
    shell: isWindows,
    env: {
      ...process.env,
      MONGO_HOST: process.env.MONGO_HOST,
      MONGO_PORT: process.env.MONGO_PORT,
      MONGO_USERNAME: process.env.MONGO_USERNAME,
      MONGO_PASSWORD: process.env.MONGO_PASSWORD,
      MONGO_DB: process.env.MONGO_DB,
      MONGODB_URI: mongoUrl,
      PORT: "9000",
    },
  });
  backendProcess.stdout?.pipe(fs.createWriteStream("./backend.log"));
  backendProcess.stderr?.pipe(fs.createWriteStream("./backend.log"));

  /*
  // --- Seed DB ---
  console.log("🌱 Seeding database...");
  await new Promise<void>((resolve, reject) => {
    const seed = spawn("node", ["./faker/index.js"], {
      cwd: path.join(appPath, "backend/public"),
      env: { ...process.env, MONGODB_URI: mongoUrl },
      shell: isWindows,
    });
    seed.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("Seed failed"))));
  });
*/
  // --- Start frontend ---
  console.log("🚀 Starting frontend...");
  frontendProcess = spawn("npm", ["start"], {
    cwd: path.join(appPath, "frontend"),
    stdio: ["ignore", "pipe", "pipe"],
    shell: isWindows,
    env: {
      ...process.env,
      PORT: "3000",
      BACKEND_URL: "http://localhost:4000",
    },
  });
  frontendProcess.stdout?.pipe(fs.createWriteStream("./frontend.log"));
  frontendProcess.stderr?.pipe(fs.createWriteStream("./frontend.log"));

  // --- Wait for app startup ---
  console.log("⏳ Waiting for services to be ready...");
  await new Promise((r) => setTimeout(r, 10_000));

  fs.writeFileSync(
    path.resolve(__dirname, "runtime.json"),
    JSON.stringify({
      mongoId: mongoContainer ? mongoContainer.getId() : null,
      backendPid: backendProcess?.pid ?? null,
      frontendPid: frontendProcess?.pid ?? null,
    })
  );

  console.log("✅ Test environment ready.");
}

export default globalSetup;

function runNpm(command: string, cwd: string) {
  const isWindows = process.platform === "win32";
  return spawn("npm", [command], {
    cwd,
    stdio: "inherit",
    shell: isWindows,
  });
}
