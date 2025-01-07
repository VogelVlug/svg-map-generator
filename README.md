# SVG Map Generator

Generate vector-based maps of Earth in SVG format using configurable projections.

## Features

- Generate Earth maps using different projections:
  - Waterman Butterfly projection (WB)
  - Winkel Tripel projection (W3)
- Support for multiple Natural Earth datasets:
  - Coastlines (50m and 110m resolution)
  - Lakes (50m and 110m resolution)
- Command-line interface for easy map generation
- Configurable projection parameters
- SVG output format

## Installation

1. Clone this repository
2. Install dependencies using either yarn or npm:
```bash
# Using yarn
yarn install

# Using npm
npm install
```

## Usage

### Command Line Interface

Generate a map using default settings (Waterman Butterfly projection, 50m coastline):
```bash
# Using yarn
yarn start

# Using npm
npm start
```

Specify projection and dataset:
```bash
# Using yarn
yarn start --projection WB --mapdata 50mcoastline

# Using npm
npm start -- --projection WB --mapdata 50mcoastline
```

### Available Options

- `--projection`: Map projection type (default: "WB")
  - WB: Waterman Butterfly
  - W3: Winkel Tripel
- `--mapdata`: Dataset to use (default: "50mcoastline")
  - 50mcoastline: Natural Earth 50m resolution coastline
  - 110mcoastline: Natural Earth 110m resolution coastline
  - 50mlakes: Natural Earth 50m resolution lakes
  - 110mlakes: Natural Earth 110m resolution lakes
- `--centre`: Center point for the projection (format: lat,lon)
- `--bounds`: Bounding box for the map (format: minLat,maxLat,minLon,maxLon)
- `--output`: Output file name (default: "map.svg")

## Data Sources

This project uses [Natural Earth](https://www.naturalearthdata.com/) data, which is in the public domain.