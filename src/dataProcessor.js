import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';
import shapefile from 'shapefile';

// Use current working directory instead of __dirname
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Extract resolution and data type from dataset name
 * @param {string} dataset Dataset name (e.g., '50mcoastline', '110mlakes')
 * @returns {{resolution: string, dataType: string}} Resolution and data type
 */
function parseDatasetName(dataset) {
  const resolution = dataset.slice(0, 3);
  const dataType = dataset.slice(3);
  return { resolution, dataType };
}

/**
 * Process and load the specified Natural Earth dataset
 * @param {string} dataset Name of the dataset to load (e.g., '50mcoastline', '50mlakes')
 * @returns {Promise<Object>} GeoJSON data
 */
export async function loadDataset(dataset) {
  const zipPath = path.join(DATA_DIR, `${dataset}.zip`);
  const tempDir = path.join(DATA_DIR, `temp_${dataset}`);
  
  console.log('Loading dataset from:', zipPath);
  console.log('Temp directory:', tempDir);
  
  try {
    // Check if the zip file exists
    try {
      await fs.access(zipPath);
      console.log('Zip file exists');
    } catch (error) {
      console.error('Error accessing zip file:', error);
      throw error;
    }
    
    // Create temp directory
    try {
      await fs.mkdir(tempDir, { recursive: true });
      console.log('Created temp directory');
    } catch (error) {
      console.error('Error creating temp directory:', error);
      throw error;
    }
    
    // Extract the zip file
    try {
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(tempDir, true);
      console.log('Extracted zip file');
      
      // List extracted files
      const files = await fs.readdir(tempDir);
      console.log('Extracted files:', files);
    } catch (error) {
      console.error('Error extracting zip:', error);
      throw error;
    }
    
    // Find the .shp file
    const { resolution, dataType } = parseDatasetName(dataset);
    const shpFile = path.join(tempDir, `ne_${resolution}_${dataType}.shp`);
    console.log('Looking for shapefile at:', shpFile);
    
    // Read the shapefile
    try {
      const source = await shapefile.open(shpFile);
      console.log('Opened shapefile');
      
      // Convert to GeoJSON FeatureCollection
      const features = [];
      let result;
      while ((result = await source.read()) && !result.done) {
        features.push(result.value);
      }
      console.log(`Converted ${features.length} features`);
      
      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
      console.log('Cleaned up temp directory');
      
      return {
        type: "FeatureCollection",
        features: features
      };
    } catch (error) {
      console.error('Error processing shapefile:', error);
      throw error;
    }
  } catch (error) {
    // Clean up temp directory in case of error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}
    
    if (error.code === 'ENOENT') {
      throw new Error(`Dataset ${dataset} not found. Please run 'npm run download-data' first. (Looking in ${zipPath})`);
    }
    throw error;
  }
}

/**
 * List available datasets in the data directory
 * @returns {Promise<string[]>} List of available dataset names
 */
export async function listDatasets() {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter(file => file.endsWith('.zip'))
      .map(file => file.replace('.zip', ''));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
} 