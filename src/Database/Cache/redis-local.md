# Test redis

## build image for example:
```
docker build -t my_redis_image .
```

## run image (REDIS_PASSWORD is on Notion)
```
docker run --name my_redis_container -e REDIS_PASSWORD=dengta2024 -p 6379:6379 -d my_redis_image
```

## test conection
```
sudo docker exec -it my_redis_container redis-cli
AUTH ****
PING or KEYS *
```