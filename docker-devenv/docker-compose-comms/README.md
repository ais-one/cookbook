## Network Between Containers - Docker Compose

How to access applications created by multiple docker compose files

They should be on the same network name

```bash
# create a network
docker network create blah-example
```

```yaml
# in docker-compose.yml add the network

networks:
  default:
    external:
      name: <network name here>
```


## Test Out Example

### Run the containers

1. create network
2. set the network names in
  - c1/docker-complse.yml
  - c2/docker-complse.yml
3. run docker-compose up for both files

### Test

```bash
# container 1 ping container 2 app
docker exec -it compose1_service1_1 ping service2

# container 2 ping container 1 app
docker exec -it compose2_service2_1 ping service1
```
