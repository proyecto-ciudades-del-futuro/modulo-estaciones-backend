# INSTALLATION AND RUNNING

## TWO MAIN METHODS



### Automatic and Recommended (Using Docker Compose)

(Note: you need Docker Compose and/or Docker Desktop installed in your machine)

1) Step on your local folder where the docker-compose.yml file is and run:

```sudo docker-compose up```

2) Check that everything works by running this command on your terminal:
```curl localhost:1026/version```


### Manually Installing and running images
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