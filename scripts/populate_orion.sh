#!/bin/bash

# Array of location-related words for station names
station_names=(
    "Buenos Aires"
    "Córdoba"
    "Rosario"
    "Mendoza"
    "La Plata"
    "San Miguel de Tucumán"
    "Mar del Plata"
    "Salta"
    "Santa Fe"
    "San Juan"
    "Resistencia"
    "Neuquén"
    "Formosa"
    "San Salvador de Jujuy"
    "Paraná"
    "Posadas"
    "Santiago del Estero"
    "Corrientes"
    "San Fernando del Valle de Catamarca"
    "Viedma"
)

# Array of corresponding coordinates for station names
coordinates=(
    "-34.6037,-58.3816"
    "-31.4167,-64.1833"
    "-32.9468,-60.6393"
    "-32.8908,-68.8272"
    "-34.9314,-57.9489"
    "-26.8241,-65.2226"
    "-38.0023,-57.5575"
    "-24.7859,-65.4117"
    "-31.6333,-60.7"
    "-31.5375,-68.5364"
    "-27.4519,-58.9869"
    "-38.9516,-68.0591"
    "-26.1775,-58.1781"
    "-24.1858,-65.2995"
    "-31.7413,-60.5116"
    "-27.3621,-55.9007"
    "-27.784,-64.2672"
    "-28.5214,-58.8208"
    "-37.1603,-57.883"
    "-40.8135,-62.9967"
)

# Generate and populate stations
for ((i = 1; i <= 20; i++)); do
    rand_index=$(( RANDOM % ${#station_names[@]} ))
    station_name="${station_names[$rand_index]} Station"

    station_sponsor="Lorawan|Wifi"

    # Get coordinates based on the station name
    coordinates_data="${coordinates[$rand_index]}"
    lat=$(echo "$coordinates_data" | awk -F',' '{print $1}')
    lng=$(echo "$coordinates_data" | awk -F',' '{print $2}')

    station_data='{
        "description": {
            "metadata": {
                "name": {
                    "value": "'"$station_name"'"
                },
                "connection": {
                    "value": "'"$station_sponsor"'"
                }
            },
            "value": "This is a test station"
        },
        "location": {
            "coordinates": [
                '$lat',
                '$lng'
            ]
        },
        "user": {
            "value": "user_1"
        }
    }'

    curl -X POST -H "Content-Type: application/json" -d "$station_data" 'http://localhost:3000/stations'
done

# Array of sensor descriptions
sensor_descriptions=(
    "Clima"
    "Particulas de Aire"
    "Calidad del Agua"
    "Ruido Ambiental"
    "Contaminación Lumínica"
    "Radiación Solar"
)

# Generate and populate sensors
for ((i = 1; i <= 50; i++)); do
    rand_index=$(( RANDOM % ${#sensor_descriptions[@]} ))
    sensor_description="Sensor ${sensor_descriptions[$rand_index]}"

    sensor_station="station_$(( (i-1) / 5 + 1 ))"

    sensor_data='{
        "station_id": "'"$sensor_station"'",
        "description": {
            "value": "'"$sensor_description"'",
            "metadata": {
                "air_quality_index": "0",
                "humidity": "0",
                "pollutants": {
                    "co2": "0",
                    "co": "0",
                    "no2": "0",
                    "o3": "0",
                    "so2": "0",
                    "pm2.5": "0",
                    "pm10": "0"
                },
                "pressure": "00",
                "temperature": "0"
            }
        }
    }'

    curl -X POST -H "Content-Type: application/json" -d "$sensor_data" 'http://localhost:3000/sensors'
done
