import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { ChildProcess, spawn } from "child_process";
import path from "path";

let mongoContainer: StartedTestContainer;
let backendProcess: ChildProcess;
let frontendProcess: ChildProcess;
let seedProcess: ChildProcess;

const getAppPath = () => {
  if (process.env.CONFAC_APP_PATH) {
    return process.env.CONFAC_APP_PATH;
  }
  return path.resolve(__dirname, "../../../confac");
};

export async function setupTestEnvironment() {
  const appPath = getAppPath();
  console.log(`Using confac app path: ${appPath}`);
  mongoContainer = await new GenericContainer("mongo:latest")
    .withExposedPorts(27017)
    .withEnvironment({
      MONGO_INITDB_DATABASE: "confac",
      MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_USERNAME?.toString() || "",
      MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_PASSWORD?.toString() || "",
    })
    .withStartupTimeout(120000)
    .withWaitStrategy(Wait.forLogMessage("Waiting for connections"))
    /*.withLogConsumer(stream => {
      stream.on("data", (line: Buffer) => console.log(`MongoDB: ${line.toString().trim()}`));
    })*/
    .start();
  console.log(
    `MongoDB started at mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
      27017
    )}`
  );

  const mongoPort = mongoContainer.getMappedPort(27017);
  const mongoUrl = `mongodb://${mongoContainer.getHost()}:${mongoPort}/confac`;

  console.log("Starting Backend process");

  backendProcess = spawn("npm", ["start"], {
    cwd: path.join(appPath, "backend"),
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
    env: {
      ...process.env,
      MONGODB_URI: mongoUrl,
      MONGO_PORT: mongoPort.toString(),
    },
  });
  console.log("Backend process started");
  console.log("Starting seed process");

  seedProcess = spawn("cd backend/public && node ./faker/index.j", {
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
  console.log("Seed process finished");

  console.log("Frontend process started");

  frontendProcess = spawn("npm", ["start"], {
    cwd: path.join(appPath, "frontend"),
    //stdio: ['inherit', 'pipe', 'pipe']
    shell: true,
  });
  console.log("Frontend process started");
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export async function teardownTestEnvironment() {
  if (mongoContainer) {
    await mongoContainer.stop();
  }
  if (backendProcess) {
    backendProcess.kill();
  }
  if (frontendProcess) {
    frontendProcess.kill();
  }
}
