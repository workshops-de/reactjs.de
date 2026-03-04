#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const scripts = [
  'fetch-trainers.js',
  'fetch-events.js',
  'fetch-course.js',
  'fetch-gravatars.js',
  'generate-default-og.js',
  'generate-og-images.js',
];

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      env: { ...process.env, PREBUILD: 'true' },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function prebuild() {
  console.log('🚀 Starting prebuild...\n');

  for (const script of scripts) {
    try {
      await runScript(script);
    } catch (error) {
      console.error(`❌ Error running ${script}:`, error.message);
    }
  }

  console.log('🎉 Prebuild complete!\n');
}

prebuild().catch((error) => {
  console.error('❌ Prebuild failed:', error);
  process.exit(1);
});
