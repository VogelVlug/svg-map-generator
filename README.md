# SVG Map Generator

Generate vector-based maps of Earth in SVG format using configurable projections.

## Features

- Generate Earth maps using Waterman Butterfly projection (WB)
- Support for multiple Natural Earth datasets (50m and 110m resolution)
- Command-line interface for easy map generation
- Configurable projection parameters
- SVG output format

## Installation

1. Clone this repository
2. Install dependencies:
```bash
yarn install
```

## Usage

### Command Line Interface

Generate a map using default settings (Waterman Butterfly projection, 50m coastline):
```bash
yarn start
```

Specify projection and dataset:
```bash
yarn start --projection WB --mapdata 50mcoast
```

### Available Options

- `--projection`: Map projection type (default: "WB" for Waterman Butterfly)
  - WB: Waterman Butterfly
  - W3: Winkel Tripel (not implemented thus far)
- `--mapdata`: Dataset to use (default: "50mcoast")
  - 50mcoast: Natural Earth 50m resolution coastline
  - 110mcoast: Natural Earth 110m resolution coastline
- `--centre`: Center point for the projection (format: lat,lon)
- `--bounds`: Bounding box for the map (format: minLat,maxLat,minLon,maxLon)

## Data Sources

This project uses [Natural Earth](https://www.naturalearthdata.com/) data, which is in the public domain.