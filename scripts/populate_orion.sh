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

# Array of words for sensor descriptions
sensor_descriptions=(
    "Clima"
    "Particulas de Aire"
    "Calidad del Agua"
    "Ruido Ambiental"
    "Contaminación Lumínica"
    "Radiación Solar"
)

# Generate and populate stations
for ((i = 1; i <= 20; i++)); do
    rand_index=$(( RANDOM % ${#station_names[@]} ))
    station_name="${station_names[$rand_index]} Station"

    station_sponsor="Sponsor $i"

    station_data='{
        "description": {
            "metadata": {
                "name": {
                    "value": "'"$station_name"'"
                },
                "sponsoredBy": {
                    "value": "'"$station_sponsor"'"
                }
            },
            "value": "This is a test station"
        },
        "location": {
            "coordinates": [
                -36.88154,
                -60.37399
            ]
        },
        "user": {
            "value": "user_1"
        }
    }'

    curl -X POST -H "Content-Type: application/json" -d "$station_data" 'http://localhost:3000/stations'
done

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
