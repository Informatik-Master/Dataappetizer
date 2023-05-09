import fetch from 'cross-fetch';
import { writeFile } from 'fs/promises';

const urls = [
  {
    filename: 'seed.json',
    url: 'http://localhost:3000/api/debug/datapoints',
  },
];

setInterval(async () => {
  console.log('pulling new seed data');
  for (const { filename, url } of urls) {
    try {
      const currentSnapshot = await (await fetch(url)).json();

      const currentSnapshotString = JSON.stringify(currentSnapshot, null, 2);

      await writeFile(filename, currentSnapshotString);
    } catch (e) {
      console.log(e);
    }
  }
}, 30_000);
