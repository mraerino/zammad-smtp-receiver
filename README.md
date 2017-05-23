# zammad-smtp-receiver

Small docker container to pipe emails into zammad via smtp.

## Usage

```bash
docker run -d mraerino/zammad-smtp-receiver
```

Use together with [zammad-docker-compose](https://github.com/zammad/zammad-docker-compose).

Either link this container to the database container (legacy method) or assign it to the same network (new default for Docker networking).
