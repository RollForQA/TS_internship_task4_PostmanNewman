const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = __dirname;
const dbBackupPath = path.join(rootDir, 'mockApi', 'db_back_up.yaml');
const dbStagePath = path.join(rootDir, 'mockApi', 'db_stage.yaml');
const apiUrl = 'http://127.0.0.1:3000/products';

function resetDb() {
  fs.copyFileSync(dbBackupPath, dbStagePath);
}

function waitForApi(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolve();
          return;
        }
        retry();
      });

      req.on('error', retry);
      req.setTimeout(2000, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() > deadline) {
        reject(new Error(`API was not ready within ${timeoutMs}ms: ${url}`));
        return;
      }
      setTimeout(check, 500);
    };

    check();
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: false,
      ...options
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${path.basename(command)} exited with code ${code}`));
    });
  });
}

async function main() {
  resetDb();

  const apiProcess = spawn(process.execPath, [
    path.join(rootDir, 'node_modules', 'yaml-server', 'src', 'index.js'),
    '--hotReload=off',
    '--autoStart=off',
    '--port',
    '3000',
    '--database',
    './mockApi/db_stage.yaml'
  ], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false
  });

  try {
    await waitForApi(apiUrl);
    await run(process.execPath, [
      path.join(rootDir, 'node_modules', 'newman', 'bin', 'newman.js'),
      'run',
      'store.collection.json',
      '--environment',
      'store.environment.ci.json',
      '--env-var',
      'baseUrl=http://127.0.0.1:3000',
      '--reporters',
      'cli,htmlextra,junit,json',
      '--reporter-htmlextra-export',
      'newman-report/store.html',
      '--reporter-htmlextra-title',
      'Store API Newman Report',
      '--reporter-junit-export',
      'newman-report/store-junit.xml',
      '--reporter-json-export',
      'newman-report/store.json',
      '--timeout-request',
      '10000',
      '--timeout-script',
      '5000'
    ]);
  } finally {
    apiProcess.kill();
    resetDb();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
