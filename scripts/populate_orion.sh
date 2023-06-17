## Populate Orion with stations

curl -X POST -H "Content-Type: application/json" -d '{
    "description": {
        "metadata": {
            "name": {
                "value": "Olavarría 1"
            },
            "sponsoredBy": {
                "value": "TELECOM ARGENTINA"
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
}' 'http://localhost:3000/stations'

curl -X POST -H "Content-Type: application/json" -d '{
    "description": {
        "metadata": {
            "name": {
                "value": "San Isidro 1"
            },
            "sponsoredBy": {
                "value": "Municipalidad de San Isidro"
            }
        },
        "value": "This is a test station"
    },
    "location": {
        "coordinates": [
            -34.468732, -58.513389
        ]
    },
    "user": {
        "value": "user_1"
    }
}' 'http://localhost:3000/stations'

curl -X POST -H "Content-Type: application/json" -d '{
    "description": {
        "metadata": {
            "name": {
                "value": "San Vicente 1"
            },
            "sponsoredBy": {
                "value": "Municipalidad de San Vicente"
            }
        },
        "value": "This is a test station"
    },
    "location": {
        "coordinates": [
            -35.024603, -58.423253
        ]
    },
    "user": {
        "value": "user_2"
    }
}' 'http://localhost:3000/stations'

## Populate Orion with Sensors


curl -X POST -H "Content-Type: application/json" -d '{
  "station_id": "station_1",
  "description": {
    "value": "Sensor de Delmers",
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
}
' 'http://localhost:3000/sensors'

curl -X POST -H "Content-Type: application/json" -d '{
"station_id": "station_1",
"description": {
  "value": "Sensor de Deboras",
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
}
' 'http://localhost:3000/sensors'

curl -X POST -H "Content-Type: application/json" -d '{
 "station_id": "station_2",
 "description": {
   "value": "Sensor de Eugenios",
   "metadata": {
     "air_quality_index": "20",
     "humidity": "10",
     "pollutants": {
       "co2": "30",
       "co": "40",
       "no2": "50",
       "o3": "90",
       "so2": "10",
       "pm2.5": "20",
       "pm10": "30"
     },
     "pressure": "10",
     "temperature": "30"
   }
 }
}' 'http://localhost:3000/sensors'

curl -X POST -H "Content-Type: application/json" -d '{
"station_id": "station_2",
"description": {
  "value": "Sensor de Jorges",
  "metadata": {
    "air_quality_index": "20",
    "humidity": "10",
    "pollutants": {
      "co2": "30",
      "co": "40",
      "no2": "50",
      "o3": "90",
      "so2": "10",
      "pm2.5": "20",
      "pm10": "30"
    },
    "pressure": "10",
    "temperature": "30"
  }
}
}' 'http://localhost:3000/sensors'

curl -X POST -H "Content-Type: application/json" -d '{
"station_id": "station_2",
"description": {
  "value": "Sensor de Brenos",
  "metadata": {
    "prueba_random": "20",
    "air_quality_index": "20",
    "humidity": "10",
    "pollutants": {
      "co2": "30",
      "co": "40",
      "no2": "50",
      "o3": "90",
      "so2": "10",
      "pm2.5": "20",
      "pm10": "30"
    },
    "pressure": "10",
    "temperature": "30"
  }
}
}' 'http://localhost:3000/sensors'
