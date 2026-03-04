#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

const TRAINER_ENDPOINTS = [
  { url: 'https://workshops.de/api/portal/reactjs-de/trainers', file: 'trainers.json' },
  { url: 'https://workshops.de/api/course/32/trainers', file: 'course_trainers/react-intensiv.json' },
  { url: 'https://workshops.de/api/course/18/trainers', file: 'course_trainers/react-native-intensiv.json' },
];

async function fetchTrainers() {
  if (process.env.SKIP_API_FETCH === 'true') {
    console.log('⏭️  Skipping trainer fetch (SKIP_API_FETCH=true)');
    return;
  }

  console.log('📥 Fetching trainers...');

  for (const endpoint of TRAINER_ENDPOINTS) {
    try {
      const response = await fetch(endpoint.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      const filePath = path.join(DATA_DIR, endpoint.file);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  ✓ ${endpoint.file}`);
    } catch (error) {
      console.error(`  ✗ ${endpoint.file}: ${error.message}`);
    }
  }

  console.log('✅ Fetching trainers...done\n');
}

fetchTrainers().catch(console.error);
