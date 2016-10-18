#!/bin/bash

# This script will start all the docker containers needed to provide our full service
# It assumes that docker is installed and usable on the particular host machine.

echo " ----- Starting ALL Docker Containers -----"

docker-compose -f docker-compose.yml -f docker-compose.web_app.yml up -d

echo " ----- The Following Docker Containers Are Running -----"

# Just in case there are MANY other docker containers running, grep on the specific ones we have started via the
# docker-compose file. These names match those in the compose file (or they should).
docker ps | grep stockstation_redis
docker ps | grep stockstation_mysql
docker ps | grep stockstation_statsd
docker ps | grep stockstation_web_app
