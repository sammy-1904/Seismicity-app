#!/usr/bin/env python3
"""
Convert ISC-GEM CSV to embedded JavaScript data file
This makes the app work as a standalone HTML file without server
"""

import csv
import json
import sys

def convert_csv_to_js(csv_file='isc-gem-cat.csv', output_file='earthquake-data.js'):
    """Convert CSV to JavaScript data file"""
    
    print(f"Reading {csv_file}...")
    earthquakes = []
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        for line in f:
            # Skip comments and empty lines
            line = line.strip()
            if line.startswith('#') or not line:
                continue
            
            # Skip header line
            if 'date' in line and 'lat' in line and 'lon' in line:
                continue
            
            # Parse data line
            parts = [p.strip() for p in line.split(',')]
            
            if len(parts) < 14:
                continue  # Skip malformed lines
            
            try:
                date_time = parts[0]
                lat = float(parts[1])
                lon = float(parts[2])
                depth = float(parts[7]) if parts[7] else 0.0
                mw = float(parts[10])
                
                # Skip if essential data is missing
                if not all([date_time, str(lat), str(lon), str(mw)]):
                    continue
                
                # Create simplified earthquake object
                eq = {
                    'dt': date_time,  # datetime
                    'la': round(lat, 3),  # latitude
                    'lo': round(lon, 3),  # longitude
                    'd': round(depth, 1),  # depth
                    'm': round(mw, 2)  # magnitude
                }
                
                earthquakes.append(eq)
                
            except (ValueError, IndexError):
                # Skip lines that can't be parsed
                continue
    
    print(f"Parsed {len(earthquakes)} earthquakes")
    
    # Write as JavaScript file
    print(f"Writing {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('// ISC-GEM Earthquake Data - Auto-generated from CSV\n')
        f.write('// This file contains embedded earthquake data for standalone HTML use\n\n')
        f.write('const EARTHQUAKE_DATA = ')
        
        # Write JSON data (this will be large but compressed by browser)
        json.dump(earthquakes, f, separators=(',', ':'))
        
        f.write(';\n\n')
        f.write('// Data statistics\n')
        f.write(f'// Total earthquakes: {len(earthquakes)}\n')
        f.write(f'// Generated from: {csv_file}\n')
    
    print(f"Done! Created {output_file} with {len(earthquakes)} earthquakes")
    print(f"\nNext steps:")
    print(f"1. The earthquake-data.js file has been created")
    print(f"2. Open index.html directly in your browser (no server needed!)")
    print(f"3. The app will use the embedded data instead of fetching CSV")

if __name__ == '__main__':
    convert_csv_to_js()
