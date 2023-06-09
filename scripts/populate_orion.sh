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
  "value": "Sensor de Calidad del Aire",
  "metadata": {
    "air_quality_index": {
      "value": "75"
    },
    "temperature": {
      "value": "25.2"
    },
    "humidity": {
      "value": "65.2"
    },
    "pressure": {
      "value": "1013.25"
    },
    "pollutants": {
      "value": {
        "co2": "400",
        "co": "2",
        "no2": "20",
        "o3": "40",
        "so2": "5",
        "pm2.5": "15",
        "pm10": "30"
      }
    }
   }
 }
}' 'http://localhost:3000/sensors'


curl -X POST -H "Content-Type: application/json" -d '{
"station_id": "station_2",
"description": {
  "value": "Sensor de Calidad del Aire",
  "metadata": {
    "air_quality_index": {
      "value": "75"
    },
    "temperature": {
      "value": "25.2"
    },
    "humidity": {
      "value": "65.2"
    },
    "pressure": {
      "value": "1013.25"
    },
    "pollutants": {
      "value": {
        "co2": "400",
        "co": "2",
        "no2": "20",
        "o3": "40",
        "so2": "5",
        "pm2.5": "15",
        "pm10": "30"
      }
    }
   }
 }
}' 'http://localhost:3000/sensors'


curl -X POST -H "Content-Type: application/json" -d '{
"station_id": "station_3",
"description": {
  "value": "Sensor de Calidad del Aire",
  "metadata": {
    "air_quality_index": {
      "value": "75"
    },
    "temperature": {
      "value": "25.2"
    },
    "humidity": {
      "value": "65.2"
    },
    "pressure": {
      "value": "1013.25"
    },
    "pollutants": {
      "value": {
        "co2": "400",
        "co": "2",
        "no2": "20",
        "o3": "40",
        "so2": "5",
        "pm2.5": "15",
        "pm10": "30"
      }
    }
   }
 }
}' 'http://localhost:3000/sensors'
