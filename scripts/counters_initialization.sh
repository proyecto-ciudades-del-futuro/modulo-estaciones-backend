
curl -X POST 'http://localhost:1026/v2/entities' -H 'Content-Type: application/json' -d '{
  "id": "stationCount",
  "type": "Counter",
  "count": {
    "value": 0,
    "type": "Integer"
  }
}'


curl -X POST 'http://localhost:1026/v2/entities' -H 'Content-Type: application/json' -d '{
  "id": "sensorCount",
  "type": "Counter",
  "count": {
    "value": 0,
    "type": "Integer"
  }
}'


curl -X POST 'http://localhost:1026/v2/entities' -H 'Content-Type: application/json' -d '{
  "id": "userCount",
  "type": "Counter",
  "count": {
    "value": 0,
    "type": "Integer"
  }
}'