import { geoGraticule, geoPath } from 'd3-geo';
import { geoPolyhedralWaterman as geoWaterman, geoWinkel3 } from 'd3-geo-projection';
import { D3Node } from 'd3-node';
import fs from 'fs/promises';
import { loadDataset } from './dataProcessor.js';

// Constants for SVG dimensions
const WIDTH = 1200;
const HEIGHT = 800;

/**
 * Generate an SVG map based on the provided options
 * @param {Object} options Configuration options for map generation
 * @returns {Promise<string>} Generated SVG content
 */
export async function generateMap(options) {
  const { projection = 'WB', mapdata = '50mcoast', output = 'map.svg', centre, bounds } = options;
  
  // Create D3 node instance
  const d3n = new D3Node();
  
  // Create SVG using D3
  const svg = d3n.createSVG(WIDTH, HEIGHT)
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
  
  // Set up projection
  const proj = setupProjection(projection, centre);
  if (bounds) {
    applyBounds(proj, bounds);
  }
  const path = geoPath().projection(proj);
  
  // Create defs for clip path
  const defs = svg.append('defs');
  
  // Add sphere path and use it for clipping
  defs.append('path')
    .datum({type: 'Sphere'})
    .attr('id', 'sphere')
    .attr('d', path);
  
  defs.append('clipPath')
    .attr('id', 'clip')
    .append('use')
    .attr('href', '#sphere');
  
  // Add sphere stroke and fill
  svg.append('use')
    .attr('href', '#sphere')
    .attr('fill', '#fff')
    .attr('stroke', '#000')
    .attr('stroke-width', '0.5');
  
  // Add graticules with clip path
  const graticule = geoGraticule().step([15, 15]);
  svg.append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('clip-path', 'url(#clip)')
    .attr('fill', 'none')
    .attr('stroke', '#666')
    .attr('stroke-width', '0.5')
    .attr('stroke-dasharray', '2,2');
  
  // Load and process map data
  const mapData = await loadDataset(mapdata);
  
  // Add map path with clip path
  svg.append('path')
    .datum(mapData)
    .attr('d', path)
    .attr('clip-path', 'url(#clip)')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', '1');
  
  // Get SVG content and save to file
  const svgContent = d3n.svgString();
  await fs.writeFile(output, svgContent, 'utf8');
  
  return svgContent;
}

/**
 * Set up the map projection based on the specified type
 * @param {string} projectionType Type of projection to use
 * @param {string} centre Optional center point (format: "lat,lon")
 * @returns {Object} Configured projection
 */
function setupProjection(projectionType, centre) {
  let proj;
  
  switch (projectionType.toUpperCase()) {
    case 'WB':
      proj = geoWaterman()
        .scale(WIDTH / 10)
        .translate([WIDTH / 2, HEIGHT / 2]);
      break;
    case 'W3':
      proj = geoWinkel3()
        .scale(WIDTH / 6)  // Winkel Tripel typically needs a different scale
        .translate([WIDTH / 2, HEIGHT / 2]);
      break;
    default:
      throw new Error(`Unsupported projection type: ${projectionType}`);
  }
  
  if (centre) {
    const [lat, lon] = centre.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lon)) {
      proj.center([lon, lat]);
    }
  }
  
  return proj;
}

/**
 * Apply bounding box to the projection if specified
 * @param {Object} projection D3 projection object
 * @param {string} bounds Bounding box string (format: "minLat,maxLat,minLon,maxLon")
 */
function applyBounds(projection, bounds) {
  const [minLat, maxLat, minLon, maxLon] = bounds.split(',').map(Number);
  if ([minLat, maxLat, minLon, maxLon].some(isNaN)) {
    throw new Error('Invalid bounds format. Expected: minLat,maxLat,minLon,maxLon');
  }
  
  projection.fitExtent(
    [[0, 0], [WIDTH, HEIGHT]],
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [minLon, minLat],
          [maxLon, minLat],
          [maxLon, maxLat],
          [minLon, maxLat],
          [minLon, minLat]
        ]]
      }
    }
  );
} 