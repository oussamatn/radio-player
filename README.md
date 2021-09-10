# Azuracast PWA Player 
###### Full documentation is coming soon.

<img src="https://user-images.githubusercontent.com/2962369/117323879-92b7af80-ae8f-11eb-9411-90fe1bc0459a.gif" width="300">


# Install AzuraCast Player
 You can play locally with the player. Todo so you can clone the project then install all the dependencies .

```
git clone https://github.com/oussamatn/radio-player.git
cd radio-player
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


# Deployment 

You can deploy the player in the same server as AzuraCast Core and serve the player trough Nginx-Reverse proxy.  

First you need to create a new domain or sub-domain name and configure it as you did with Azuracast domain. ( same ip address)
## Docker Compose 
Go to your Azuracast installation folder then clone the project
``` 
git clone https://github.com/oussamatn/radio-player.git
```

#### config.json
Update you API URL and radio name inside the configuration file : config.json ( file inside `public/assets`)
``` JSON
{
  "api_url" : "https://azuracast-backend-link.com/api",
  "title": "Azuracast | Radio Station",
  "description" : "Live Radio 24/7 Hits music Only ",
  "manifest" : {
    "short_name": "Joujma FM",
    "orientation": "portrait",
    "display": "standalone",
    ...
```
#### .env
``` BASH
# Additional Environment Variables
PLAYER_HOSTNAME=player.yourdomain.com
```

#### docker-compose.override.yml
``` YML
version: '2.2'
services:
    radio-player:
        restart: always
        container_name: radio-player
        build:
          context: ./radio-player
        env_file : azuracast.env
        hostname: ${PLAYER_HOSTNAME}
        volumes:
            - letsencrypt:/etc/nginx/certs:ro
            - /var/run/docker.sock:/var/run/docker.sock
        ports:
            - "8080:8080"
        environment:
            VIRTUAL_HOST : ${PLAYER_HOSTNAME:-player.local}
            VIRTUAL_PORT : 8080
            NODE_ENV : production
            LETSENCRYPT_HOST : ${PLAYER_HOSTNAME}
            LETSENCRYPT_EMAIL : ${LETSENCRYPT_EMAIL}
            
        networks :
            - frontend
```

On your server side go to AzuraCast directory then run : 
```shell 
user@host:~$ docker-compose build radio-player

user@host:~$ docker-compose up -d
```

