import fetch from 'cross-fetch';
import { writeFile } from 'fs/promises';

const urls = [
  {
    filename: 'seed.json',
    url: 'http://localhost:3000/api/debug/datapoints',
  },
  {
    filename: 'vehicles.json',
    url: 'http://localhost:3000/api/debug/vehicles',
  },
  {
    filename: 'systems.json',
    url: 'http://localhost:3000/api/systems',
  },
];

setInterval(async () => {
  console.log('pulling new seed data');
  for (const { filename, url } of urls) {
    try {
      const currentSnapshot = await (await fetch(url)).json();
      if (currentSnapshot.length === 0) continue;
      const currentSnapshotString = JSON.stringify(currentSnapshot, null, 2);

      await writeFile(filename, currentSnapshotString);
    } catch (e) {
      console.log(e);
    }
  }
}, 30_000);
