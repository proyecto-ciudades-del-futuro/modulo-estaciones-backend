# Módulo Estaciones \[ORT N2 - BELGRANO - Brusca, Landa, Sirito, Rodriguez, Rilla]

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [New Section](#new-section)

## Introduction

Modulo Estaciones will integrate with the Ciudades del Futuro project to set up an IoT network of air quality monitoring
stations across Argentina's territory.

## Installation

### INSTALLATION AND RUNNING

TWO MAIN METHODS

##### A) Automatic and Recommended (Using Docker Compose)

(Note: you need Docker Compose and/or Docker Desktop installed in your machine)

1) Step on your local folder where the docker-compose.yml file is and run:

```sudo docker-compose up```

2) Check that everything works by running this command on your terminal:
   ```curl localhost:1026/version```

##### B) Manually Installing and running images

***

1) Install Docker Desktop
2) Run the following commands to download the required docker images:

```
docker pull mongo:4.4
docker pull fiware/orion
```

3) Create a network for the containers to connect

```
docker network create fiware_default
```

4) Run the MongoDB Docker Container with:

```
docker run -d --name=mongo-db --network=fiware_default \
  --expose=27017 mongo:4.4 --bind_ip_all
```

5) Start Orion Context Broker

```
docker run -d --name fiware-orion -h orion --network=fiware_default \
  -p 1026:1026  fiware/orion -dbhost mongo-db
```

Now you will have both the Orion Context Broker and the MongoDB ready to start with locally

@@ Important guidelines to interact with ORION CONTEXT BROKER API:

https://fiware-orion.readthedocs.io/en/2.4.0/user/walkthrough_apiv2/index.html

### TROUBLESHOOTING

If you have issues with your docker instances, try to reinitilize them via the following commands:

1. List the running containers running
   `docker ps` in the terminal. That command will list every running container along with their container IDs and other
   details
2. Copy the container IDs of the Orion/MongoDB instances and run this command `docker stop <container_id>`
3. Verify that the containers have stopped with `docker ps`
4. Now remove the stopped containers with `docker rm <container_id>`
5. Verify that the containers have been removed with: `docker ps -a`
6. Run again your docker instances

## Usage

API Documentation
===========

***
# API Data Structures

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

As you see, in the previous example, the id and type keys can have a direct value, but attributes must be defined as JSON objects with their corresponding keys.
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
        "type": "Integer",
        "value": 1,
        "metadata": {}
    }
}

```
### Station entity Fields
- **id** (String): The unique identifier of the station must follow this pattern > a string that begins with 'station_' followed by a sequence of numbers. The first digit must not be a 0. example: station_1
- **type** (String): This is always "Station" for stations. (handled by the server)
- **description** (Object): 
  - **type**: "String" (added by the server)
  - **value**: (String, the description you want to add for that particular station)
  - **metadata**: (Object)
- **location** (Object):
  - **type** "geo:json" (added by the server)
  - **value** (Object) (added by the server)
    - **type** (Point) (added by the server)
    - **coordinates** (Array<number[2]>)
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
  - **type**: "Integer" (added by the server)
  - **value**: (Integer)
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
- **id** (String): The unique identifier of the sensor must follow this pattern > a string that begins with 'sensor_' followed by a sequence of numbers. The first digit must not be a 0. example: sensor_1
- **type** (String): This is always "Sensor" for stations. (handled by the server) 
- **description** (Object):
    - **type**: "String" (added by the server)
    - **value**: (String, the description you want to add for that particular sensor, for example "Temperature")
    - **metadata**: (Object)
- **station_id**: (Object)
  - **type**: (String) (added by the server)
  - **value**: (station id) there is a bidirectional association between Station and Sensor
  - **metadata**: (Object)
***

# Stations / Estaciones

## Query Every Station

- <u>HTTP Method:</u> `GET`
- <u>Endpoint URL:</u> `/stations/`

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

- `id` (string): a unique identifier for the Station entity. The format of the id should be "station_xx" (xx being a
  number from 1, no leading zero's are allowed)
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
    "id": "station_3",
    "description": {
        "metadata": {},
        "value": "This is a test station"
    },
    "location": {
        "coordinates": [51.5074,-0.1278],
        "metadata": {}
    },
    "user": {
        "value": 1,
        "metadata": {}
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


<!-- ## New Section -->



