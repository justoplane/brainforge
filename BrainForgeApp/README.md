# React + Express Starter App
## Setup
### Prerequesites
- Docker

### First Time Project Setup
#### Create .env files
- In the `server` folder create a file called `.env` and copy the values from `example.env` into it. Again, defaults are just fine here.
- In the `worker` folder create a file called `.env` and copy the values from `example.env` into it. Again, defaults are just fine here.

#### Create and run containers
```bash
docker compose up
```

This will create the images, start the containers, and create the volumes and networks using docker-compose. Some of the services will probably crash because the database hasn't been initialized, but this ok, move on to the next section.

#### Migrate the Database
Run
```bash
docker compose exec server npm run migrate-dev
```
This will run the migrations and seeds.

After this, terminate the running containers and rerun `docker compose up`

You should be good to go now!

### Helpful Details
The repo is setup to use VS Code Dev Containers which create an ssh connection to a running container to allow you edit the code in the container (which will give you intellisense without having to install any dependencies on your host machine).

Look at the /server/package.json file for a bunch of helpful scripts for inspect the database. Run the scripts by running `docker-compose exec server npm run <script name>`


