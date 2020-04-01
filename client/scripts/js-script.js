import shelljs from "shelljs";

const instances = {
  B1: "TINY",
  B2: "SMALL",
  B4: "MEDIUM",
  B8: "LARGE"
};

const instanceTypes = [
  {
    server: "java",
    db: "sql"
  },
  {
    server: "node",
    db: "sql"
  },
  {
    server: "java",
    db: "nosql"
  },
  {
    server: "node",
    db: "nosql"
  }
];

const sizes = [1];
const frequencies = [1];

async function execute(instanceSize, instanceType, dbType, size, frequency) {
  const command = `yarn start ../index.js --instance ${instanceSize} --server ${instanceType} --db ${dbType} --size ${size} --freq ${frequency}`;

  const prom = new Promise((resolve, reject) => {
    shelljs.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });

  await prom.then();
}

async function sleep(time) {
  const prom = new Promise((resolve, reject) => {
    shelljs.exec(`sleep ${time}`, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });

  await prom.then();
}

async function runAll() {
  const entries = Object.entries(instances);

  for (const entry of entries) {
    console.log(`Running ${entry[0]} tests...`);
    const instanceSize = entry[1];

    for (const size of sizes) {
      for (const freq of frequencies) {
        for (const type of instanceTypes) {
          await execute(instanceSize, type.server, type.db, size, freq);
        }
        await sleep(5);
      }
    }

    console.log(`${entry[0]} tests complete`);
  }
}

runAll();
