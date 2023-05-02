

# Módulo Estaciones \[ORT N2 - BELGRANO - Brusca, Landa, Sirito, Rodriguez, Rilla]

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [New Section](#new-section)

## Introduction

Modulo Estaciones will integrate with the Ciudades del Futuro project to set up an IoT network of air-quality stations across Argentina's territory.

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


## Usage


## API Documentation


### Stations / Estaciones

##### Creating a Station Entity: POST Request
To create a Station entity, send a POST request to the designated API endpoint you should comply with the following data structure of the payload since the server will interact with ORION interface.


### Request Body

The request body is a JSON object with the following attributes:

- `id` (string): a unique identifier for the Station entity
- `type` (string): the type of entity, which should be "Station"
- `description` (object): a description of the station, with the following attributes:
    - `type` (string): the data type of the description, which should be "String"
    - `metadata` (object): any additional metadata associated with the description (optional)
    - `value` (string): the description text
- `location` (object): the geographic location of the station, with the following attributes:
    - `type` (string): the data type of the location, which should be "geo:json"
    - `value` (object): a GeoJSON object representing the location
    - `metadata` (object): any additional metadata associated with the location (optional)
- `user` (object): the user associated with the station, with the following attributes:
    - `type` (string): the data type of the user, which should be "Integer"
    - `value` (integer): the user identifier
    - `metadata` (object): any additional metadata associated with the user (optional)
- `stationState` (object): the state of the station, with the following attributes:
    - `type` (string): the data type of the state, which should be "String"
    - `metadata` (object): any additional metadata associated with the state (optional)
    - `value` (string): the state of the station, which should be one of "ENABLED", "DISABLED", or "INACTIVE"

### Example Request:

```
POST /api/v1/stations HTTP/1.1
Host: example.com
Content-Type: application/json

{
    "id": "station3",
    "type": "Station",
    "description": {
        "type": "String",
        "metadata": {},
        "value": "This is a test station"
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
    "user": {
        "type": "Integer",
        "value": 1,
        "metadata": {}
    },
    "stationState": {
        "type": "String",
        "metadata": {},
        "value": "ENABLED"
    }
}
```

<!-- ## Contributing -->


<!-- ## License -->


<!-- ## New Section -->



