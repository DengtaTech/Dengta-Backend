# Test redis

## build image (REDIS_PASSWORD is on Notion) for example:
```
docker build --build-arg REDIS_PASSWORD=**** -t my_redis_image .
```

## run image
```
docker run --name my_redis_container -p 6379:6379 -d my_redis_image
```

## test conection
```
sudo docker exec -it my_redis_container redis-cli
AUTH ****
PING or KEYS *
```