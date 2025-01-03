import { geoGraticule, geoPath } from 'd3-geo';
import { geoPolyhedralWaterman as geoWaterman } from 'd3-geo-projection';
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
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
  
  // Create virtual DOM for SVG manipulation
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const document = dom.window.document;
  
  // Create SVG element with white background
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', WIDTH);
  svg.setAttribute('height', HEIGHT);
  svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
  
  // Add white background
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', '100%');
  background.setAttribute('height', '100%');
  background.setAttribute('fill', 'white');
  svg.appendChild(background);
  
  // Set up projection
  const proj = setupProjection(projection, centre);
  if (bounds) {
    applyBounds(proj, bounds);
  }
  const path = geoPath().projection(proj);
  
  // Add graticules (grid lines) using D3's built-in graticule generator
  const graticule = geoGraticule().step([15, 15]);
  const graticulePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  graticulePath.setAttribute('d', path(graticule()));
  graticulePath.setAttribute('fill', 'none');
  graticulePath.setAttribute('stroke', '#666');
  graticulePath.setAttribute('stroke-width', '0.5');
  graticulePath.setAttribute('stroke-dasharray', '2,2');
  svg.appendChild(graticulePath);
  
  // Load and process map data
  const mapData = await loadDataset(mapdata);
  
  // Create path element for the map
  const mapPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  mapPath.setAttribute('d', path(mapData));
  mapPath.setAttribute('fill', 'none');
  mapPath.setAttribute('stroke', 'black');
  mapPath.setAttribute('stroke-width', '1');
  svg.appendChild(mapPath);
  
  // Save the SVG to file
  const svgContent = svg.outerHTML;
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