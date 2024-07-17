# Test DB

## Using test DB from docker

```
docker run -d --pull always -p 3309:3306 dengtatech/testing-db 
```

## Upload test DB image to docker hub

1. Run `backup-remote.sh` to generate current `backup.sql`
```sh
cd backend/scripts/testDB/
sh backup-remote.sh
```

2. Login docker (the password is on the Notion)
```sh
docker login --username dengtatech
```

3. **Modify the password in command**. Then build image and push
```sh
docker buildx build --build-arg MYSQL_ROOT_PASSWORD=[PASSWORD_HERE] \
 --platform linux/amd64,linux/arm64 --push  -t dengtatech/testing-db:latest -f Dockerfile .
```
