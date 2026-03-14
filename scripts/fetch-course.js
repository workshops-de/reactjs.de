#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

async function fetchCourse() {
  if (process.env.SKIP_API_FETCH === 'true') {
    console.log('⏭️  Skipping course fetch (SKIP_API_FETCH=true)');
    return;
  }

  console.log('📥 Fetching course...');

  try {
    const response = await fetch('https://workshops.de/api/courses/32');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    const filePath = path.join(DATA_DIR, 'course.json');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  ✓ course.json`);

  } catch (error) {
    console.error(`  ✗ course.json: ${error.message}`);
  }

  console.log('✅ Fetching course...done\n');
}

fetchCourse().catch(console.error);
