# Módulo Estaciones \[ORT N2 - BELGRANO - Brusca, Landa, Sirito, Rodriguez, Rilla]

- [Introduction](#introduction)
- [Installation](#installation)
- [Counters initialization](#counters-initialization)
- [Troubleshooting](#troubleshooting)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
<!-- - [New Section](#new-section) -->

## Introduction
***
Modulo Estaciones will integrate with the Ciudades del Futuro project to set up an IoT network of air quality monitoring
stations across Argentina's territory.

## Installation
***
### INSTALLATION AND RUNNING

 **Note: You must have Docker Compose and/or Docker Desktop installed in your machine**


##### A) Mount and run Orion Context Broker


1) Step on your local folder where the docker-compose.yml file is, open a new terminal and run:
```docker-compose up``` or ```sudo docker-compose up``` if your machine requires superuser privileges


2) Step on the root directory and run the following command to ensure that the counters-initialization.sh script can be run by node:
```chmod +x ./scripts/counters_initialization.sh```

3) Also, on the same dir run ```chmod +x ./scripts/populate_orion.sh```

4) Initialize the counters with:
 
    ```
    MAC/LINUX
    npm run devInit

    WINDOWS: in a GIT BASH or LINUX BASH
    ./scripts/counters_initialization.sh
   ```

##### B) Start the Express runtime

1) If you don't have Typescript install it globally or locally:
```npm install -g ts-node``` or 
```npm install -g ts-node```

2) run
````npm install```` to add every dependency

3) run ````npm run dev````

4) Populate the Orion Context to have data to play with
   ```
   MAC/LINUX
   npm run devPopulate

   WINDOWS: in a GIT BASH or LINUX BASH
   ./scripts/populate_orion.sh


READY!

Now you will have the ExpressJS server, the Orion Context Broker and the MongoDB ready to start with locally



@@ Important guidelines to interact with ORION CONTEXT BROKER API:

https://fiware-orion.readthedocs.io/en/2.4.0/user/walkthrough_apiv2/index.html

## Counters initialization
***
Due to the abscence of an "order-by" capabilty from Orion Context Broker, the Id's generation is handled via a counter that's initialized for the Station, Sensor and User entities. The counters initialization is handled by the
```counters_initialization.sh``` script located on the
```scripts/``` directory.


## Troubleshooting

***
DOCKER
---

If you have issues with your docker instances, try to reinitialize them via the following commands:

1. List the running containers running
   `docker ps` in the terminal. That command will list every running container along with their container IDs and other
   details
2. Copy the container IDs of the Orion/MongoDB instances and run this command `docker stop <container_id>`
3. Verify that the containers have stopped with `docker ps`
4. Now remove the stopped containers with `docker rm <container_id>`
5. Verify that the containers have been removed with: `docker ps -a`
6. Run again your docker instances




General
===========
***

# Orion Context Broker Data Structures

### General rule for entities definition:

To ensure compatibility with the *Orion Context Broker*, each entity must adhere to the subsequent structure:

- id: identifier (unique String)
- type: String
- Attributes: each attribute has to be defined as an JSON object.

For example:

```
{
    "id": "station_1",
    "type": Station,
    "sensors": {
        type: "StructuredValue",
        "value": [
            {
                "id": "sensor_4",
                "type": "Sensor"
            }
        ]
    }
}
```

As you see, in the previous example, the id and type keys can have a direct value, but attributes must be defined as
JSON objects with their corresponding keys.
***

## Station Entity structure

```
{
    "id": "station_1",
    "type": "Station",
    "description": {
        "type": "String",
        "value": "This is a test station",
        "metadata": {
            "sponsoredBy": {
                "value": "Government",
                "type": "String"
            } 
        }
    },
    "location": {
        "type": "geo:json",
        "value": {
            "type": "Point",
            "coordinates": [
                51.5074,
                -0.1278
            ]
        },
        "metadata": {}
    },
    "sensors": {
        "type": "StructuredValue",
        "value": [
            {
                "id": "sensor_4",
                "station_id": {
                    "type": "String",
                    "value": "station_2"
                },
                "type": "Sensor",
                "description": {
                    "type": "String",
                    "value": "Temperature",
                    "metadata": {}
                }
            }
        ],
        "metadata": {}
    },
    "stationState": {
        "type": "String",
        "value": "IN_APPROVAL",
        "metadata": {}
    },
    "user": {
        "type": "Relationship",
        "value": "station_1",
        "metadata": {}
    }
}

```

### Station entity Fields

- **id** (String): The unique identifier of the station follows this pattern > a string that begins with 'station_'
  followed by a sequence of numbers. The first digit must not be a 0. example: station_1 (handled by the server)
- **type** (String): This is always "Station" for stations. (handled by the server)
- **description** (Object):
    - **type**: "String" (added by the server)
    - **value**: (String, the description you want to add for that particular station)
    - **metadata**: (Object)
- **location** (Object):
    - **type** "geo:json" (added by the server)
    - **value** (Object) (added by the server)
        - **type** (Point) (added by the server)
        - **coordinates** (Array<number | string [2]>) (The first element is the longitude, which should be a number
          between -180 and 180.
          The second element is the latitude, which should be a number between -90 and 90.)
        - **metadata** (Object)
- **sensors** : (Object)
    - **type**: "StructuredValue" (added by the server)
    - **value**: (Array<Station>)
    - **metadata**: (Object)
- **stationState**: (Object)
    - **type**: "String" (added by the server)
    - **value**: enum <<STATION_STATE>>
    - **metadata**: (Object)
- **user**: (Object)
    - **type**: "Relationship" (added by the server)
    - **value**: "station_xx" (string)
    - **metadata**: (Object)

***

## Sensor Entity structure

```
{
    "id": "sensor_10",
    "type": "Sensor",
    "description": {
        "type": "String",
        "value": "Atmospheric Temperature in Celsius",
        "metadata": {
            "temperatura_media_anual": {
                "type": "Integer",
                "value": 10
            }
        }
    },
    "station_id": {
        "type": "String",
        "value": "station_2",
        "metadata": {}
    }
}
```

### Sensor entity Fields

- **id** (String): (creation handled by the server) example: sensor_1
- **type** (String): This is always "Sensor" for stations. (handled by the server)
- **description** (Object):
    - **type**: "String" (added by the server)
    - **value**: (String, the description you want to add for that particular sensor, for example "Temperature")
    - **metadata**: (Object)
      "air_quality_index": number as string,
      "humidity": number as string,
      "pollutants": {
      "co2": number as string,
      "co": number as string,
      "no2": number as string,
      "o3": number as string,
      "so2": number as string,
      "pm2.5": number as string,
      "pm10": number as string
      },
      "pressure": number as string,
      "temperature": number as string
      }
- **station_id**: (Object)
    - **type**: (String) (added by the server)
    - **value**: (station id) there is a bidirectional association between Station and Sensor
    - **metadata**: (Object)

***
API DOCUMENTATION
===========
***
# Stations / Estaciones

## Query Every Station

- <u>HTTP Method:</u> `GET`
- <u>Endpoint URL:</u> `/stations/`

### Example Response:

```
{
    "id": "station_1",
    "user": "user_1",
    "description": {
        "value": "This is a test station",
        "metadata": {
            "name": {
                "type": "Text",
                "value": "San Pedrito"
            },
            "razon": {
                "type": "Text",
                "value": "Quiero inscribirla por que yabalabakabaka"
            }
        }
    },
    "location": [
        51.5074,
        0.1278
    ],
    "sensors": [],
    "stationState": "IN_APPROVAL",
    "dateCreated": "2023-05-27T20:08:57.784Z",
    "dateModified": "2023-05-27T20:08:57.784Z"
},
```

## Query Station by Id

- <u>HTTP Method</u>: `GET`
- <u>Endpoint URL</u>: `/stations/:id`

## Query used Station ids service

- <u>HTTP Method</u>: `GET`
- <u>Endpoint URL</u>: `/stations/?fields=id`

## Create Station

- <u>HTTP Method</u>: `POST`
- <u>Endpoint URL</u>: `/stations/`
- <u>Headers</u>: Content-Type</u>: `application/json`

##### Creating a Station Entity: POST Request

To create a Station entity, send a POST request to the designated API endpoint you should comply with the following data
structure of the payload since the server will interact with ORION interface.

### Request Body

The request body is a JSON object with the following attributes:

- `description` (object): a description of the station, with the following attributes:
    - `metadata` (object): any additional metadata associated with the description (optional)
    - `value` (string): the description text
- `location` (object): the geographic location of the station, with the following attributes:
    - `coordinates` (Array<number[2]):  `[51.5074,
      -0.1278]`
    - `metadata` (object): any additional metadata associated with the location (optional)
- `user` (object): the user associated with the station, with the following attributes:
    - `value` (integer): the user identifier
    - `metadata` (object): any additional metadata associated with the user (optional)

By default, a new station will be created with the STATION_STATE attribute set as "ENABLED" and an empty Array of
sensors.

### Example Request:

```
POST /stations HTTP/1.1
Host: example.com
Content-Type: application/json

{
    "description": {
        "metadata": {},
        "value": "This is a test station"
    },
    "location": {
        "coordinates": [51.5074,-0.1278],
    },
    "user": {
        "value": 1,
    }
}
```

## Update Station

- <u>HTTP Method</u>: `PATCH`
- <u>Endpoint URL</u>: `/stations/:id`
- <u>Headers</u>: Content-Type</u>: `application/json`

To update a Station entity, the verb to be used is `PATCH`, any attributes excepting the station_id and STATION_STATE
can be modified

### EXAMPLE REQUEST:

```
PATCH /stations/station_20 HTTP/1.1
Host: example.com
Content-Type: application/json

{
    "sensors": {
      "value": [{
          "station_id": "station_1",
          "id": "sensor_1",
      }]
    }
}
```

<!-- ## Contributing -->


<!-- ## License -->









***

# Sensors / Sensores

## Query Every Sensor

- <u>HTTP Method:</u> `GET`
- <u>Endpoint URL:</u> `/sensors/`

### Example Response: will return a sensor's collection

```
[
    {
        "id": "sensor_1",
        "description": {
            "value": "Sensor de Calidad del Aire",
            "metadata": {
                "air_quality_index": "75",
                "humidity": "65.2",
                "pollutants": {
                    "co2": "400",
                    "co": "2",
                    "no2": "20",
                    "o3": "40",
                    "so2": "5",
                    "pm2.5": "15",
                    "pm10": "30"
                },
                "pressure": "1013.25",
                "temperature": "25.2"
            }
        },
        "station_id": "station_1",
        "dateCreated": "2023-06-14T00:06:32.393Z",
        "dateModified": "2023-06-14T00:06:32.393Z"
    },
    {
        "id": "sensor_2",
        "description": {
            "value": "Sensor de Presión del Aire",
            "metadata": {
                "air_quality_index": "100",
                "humidity": "65.2",
                "pollutants": {
                    "co2": "4",
                    "co": "2",
                    "no2": "2",
                    "o3": "4",
                    "so2": "3",
                    "pm2.5": "2",
                    "pm10": "1"
                },
                "pressure": "59393",
                "temperature": "20.2"
            }
        },
        "station_id": "station_1",
        "dateCreated": "2023-06-14T00:06:32.510Z",
        "dateModified": "2023-06-14T00:06:32.510Z"
    },
]
```

## Query Sensor by Id

- <u>HTTP Method</u>: `GET`
- <u>Endpoint URL</u>: `/sensors/:id`

### Response: will return a given station object

## Create Sensor

- <u>HTTP Method</u>: `POST`
- <u>Endpoint URL</u>: `/sensors/`
- <u>Headers</u>: Content-Type</u>: `application/json`

##### Creating a Station Entity: POST Request

To create a Station entity, send a POST request to the designated API endpoint you should comply with the following data
structure of the payload since the server will interact with ORION interface.

### Request Body

The request body is a JSON object with the following attributes:

- `station_id` (string): a reference to the station that the sensor will be bound to.
- `description` (object): the geographic location of the station, with the following attributes:
    - `value` (String):  `example: Temperature Sensor`
    - `metadata` (object): any additional metadata associated with the sensor (optional) | an object with key/value
      pairs that contains an object per value. for example:
  ```
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
  ```

### Example Request:

```
POST /sensors HTTP/1.1
Host: example.com
Content-Type: application/json

{
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
}
```

## Update Station

- <u>HTTP Method</u>: `PATCH`
- <u>Endpoint URL</u>: `/sensor/:id`
- <u>Headers</u>: Content-Type</u>: `application/json`

To update a Sensor entity, the verb to be used is `PATCH`, any attributes excepting the sensor_id can be modified

### EXAMPLE REQUEST:

Updating the sensor's station reference

```
PATCH /sensors/sensor_1 HTTP/1.1
Host: example.com
Content-Type: application/json

{
    "station_id": "station_2"
}
```

<!-- ## Contributing -->


<!-- ## License -->






