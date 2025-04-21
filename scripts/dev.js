const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

// Function to run a command and pipe its output
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function startDev() {
  try {
    // Check if database is initialized
    console.log('Checking database connection...');
    await runCommand('node', ['scripts/init-db.js']);

    // Start the development server
    console.log('Starting development server...');
    await runCommand('npm', ['run', 'start:dev'], {
      env: {
        ...process.env,
        NODE_ENV: 'development',
      },
    });
  } catch (error) {
    console.error('Error starting development server:', error);
    process.exit(1);
  }
}

startDev(); 