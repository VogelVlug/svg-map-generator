import { Command } from 'commander';
import { generateMap } from './mapGenerator.js';

const program = new Command();

program
  .name('svg-map-generator')
  .description('Generate SVG maps with different projections')
  .version('1.0.0')
  .option('-p, --projection <type>', 'projection type (WB or W3)', 'WB')
  .option('-m, --mapdata <datasets>', 'comma-separated list of datasets (e.g., "50mcoastline,50mlakes")', '50mcoastline')
  .option('-c, --center <lat,lon>', 'center point of the projection')
  .option('-b, --bounds <minLat,maxLat,minLon,maxLon>', 'bounding box for the map')
  .option('-s, --styling <options>', 'comma-separated styling options (e.g., linethickness=1,background=white)')
  .option('-o, --output <file>', 'output file name', 'map.svg');

program.parse();

const options = program.opts();

// Parse styling options if provided
if (options.styling) {
  options.styles = Object.fromEntries(
    options.styling.split(',').map(style => {
      const [key, value] = style.split('=');
      return [key.trim(), value.trim()];
    })
  );
}

try {
  const svg = await generateMap(options);
  console.log(`Map generated successfully: ${options.output}`);
} catch (error) {
  console.error('Error generating map:', error.message);
  process.exit(1);
} 