# Name.com Dynamic DNS Service

## Configure

```
# .env
USERNAME=
PASSWORD=
DOMAIN=
HOST=
```

Username is your Name.com username.

Password is a Name.com API token.

Let's say we're setting up `home.domain.tld`.

Domain is `domain.tld`.

Host is `home`.

## Logging

```
# .env
LOGGING=true
```

## Scheduled Service

With [serviceman](https://webinstall.dev/serviceman).

```bash
sudo serviceman add --name namecomdynamicdns --system node service.js
```
