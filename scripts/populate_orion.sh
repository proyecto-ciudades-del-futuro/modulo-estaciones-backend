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
        "value": "Temperature sensor",
        "metadata": {
            "unit": {
                "value": "celsius"
            },
            "averageTemperature": {
                "value": 30
            },
            "minTemperature": {
                "value": 15
            }
        }
    }
}' 'http://localhost:3000/sensors'


curl -X POST -H "Content-Type: application/json" -d '{
    "station_id": "station_1",
    "description": {
        "value": "Particles sensor",
        "metadata": {
            "particlesType": {
              "value": "PM2.5"
            },
            "unit": {
                "value": "p/m2"
            },
            "referenceValues": {
                "value": {
                  "Good": "0-12",
                  "Moderate": "12-35",
                  "Unhealthy for Sensitive Groups": "35-55",
                  "Unhealthy": "55-150",
                  "Very Unhealthy": "150-250",
                  "Hazardous": "250+"
                }
            },
            "minTemperature": {
                "value": 15
            }
        }
    }
}' 'http://localhost:3000/sensors'


curl -X POST -H "Content-Type: application/json" -d '{
    "station_id": "station_1",
    "description": {
        "value": "Particles sensor",
        "metadata": {
            "particlesType": {
              "value": "PM10"
            },
            "unit": {
                "value": "p/m2"
            },
            "referenceValues": {
                "value": {
                  "Good": "0-54",
                  "Moderate": "54-154",
                  "Unhealthy for Sensitive Groups": "154-254",
                  "Unhealthy": "254-354",
                  "Very Unhealthy": "354-424",
                  "Hazardous": "424+"
                }
            }
        }
    }
}' 'http://localhost:3000/sensors'

