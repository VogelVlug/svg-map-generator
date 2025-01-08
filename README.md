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
- Multiple dataset support (combine coastlines and lakes)
- Customizable styling options

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

Generate a map with both coastlines and lakes:
```bash
# Using yarn
yarn start --projection W3 --mapdata 50mcoastline,50mlakes

# Using npm
npm start -- --projection W3 --mapdata 50mcoastline,50mlakes
```

Customize map styling:
```bash
# Using yarn
yarn start --styling linethickness=2,linecolor=blue,background=lightgray

# Using npm
npm start -- --styling linethickness=2,linecolor=blue,background=lightgray
```

### Available Options

- `--projection`: Map projection type (default: "WB")
  - WB: Waterman Butterfly (best for world maps)
  - W3: Winkel Tripel (better for regional maps)
- `--mapdata`: Comma-separated list of datasets (default: "50mcoastline")
  - 50mcoastline: Natural Earth 50m resolution coastline
  - 110mcoastline: Natural Earth 110m resolution coastline
  - 50mlakes: Natural Earth 50m resolution lakes
  - 110mlakes: Natural Earth 110m resolution lakes
- `--center`: Center point for the projection (format: lat,lon)
- `--bounds`: Bounding box for the map (format: minLat,maxLat,minLon,maxLon)
- `--output`: Output file name (default: "map.svg")
- `--styling`: Comma-separated list of style options
  - linethickness: Thickness of map data lines (default: "1")
  - linecolor: Color of map data lines (default: "black")
  - outlinethickness: Thickness of projection outline (default: "0.5")
  - outlinecolor: Color of projection outline (default: "black")
  - showgraticules: Show grid lines (default: "true")
  - background: Background color of the projection (default: "white")

## Data Sources

This project uses [Natural Earth](https://www.naturalearthdata.com/) data, which is in the public domain.