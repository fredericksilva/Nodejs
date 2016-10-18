#!/bin/bash

# This script will start a single "disposable" instance and connect the caller to it.
# The instance will link to all infrastructure, including the service containers (if it exists)
IMAGE_NAME="nodejsstockstation_web_app"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${SCRIPT_DIR}")"

# First check if our image has been built. If not, build it.
if [[ $(docker inspect --format='{{.RepoTags}}' ${IMAGE_NAME}) == "[${IMAGE_NAME}:latest]" ]]; then
    echo " ----- Web App Image Available for Use. -----"
else
    echo " ----- Web App Image Does Not Exist. Building Now. -----"
    docker build -t ${IMAGE_NAME} ${ROOT}
fi

echo " ----- Starting Up Infrastructure Containers -----"

docker-compose up -d

echo " ----- Using .env File from [${ROOT}] -----"
echo " ----- Starting Disposable Docker Container -----"

# Now, depending on whether our services are running or not, link them into our disposable container.
# NB: This file is hardcoded based on settings in the composer files and the env file.
if [[ $(docker inspect --format='{{.State.Status}}' stockstation_web_app) == "running" ]]; then
    echo " ----- Linking in Web App -----"
    docker run \
        -i \
        -t \
        -p 8000 \
        -p 5858 \
        -v ${ROOT}:/src \
        --env-file=${ROOT}/.env \
        --link=stockstation_web_app:stockstation \
        --link=stockstation_redis:redis \
        --link=stockstation_mysql:mysql \
        --link=stockstation_statsd:statsd \
        ${IMAGE_NAME} \
        sh -c "docker/prep.sh && bash"
else
    echo " ----- Web App Not Running. It Will Not Be Linked In. -----"
    docker run \
        -i \
        -t \
        -p 8000 \
        -p 5858 \
        -v ${ROOT}:/src \
        --env-file=${ROOT}/.env \
        --link=stockstation_redis:redis \
        --link=stockstation_mysql:mysql \
        --link=stockstation_statsd:statsd \
        ${IMAGE_NAME} \
        sh -c "docker/prep.sh && bash"
fi

echo " ----- EXITED from disposable container -----"
echo " ----- Removing Exited Containers. -----"

# Now grep through all containers and stop those that have been "exited". Only do that for our service.
docker ps -a | grep Exited | awk '{ print $1,$2 }' | \
grep ${IMAGE_NAME} |  awk '{print $1 }' | xargs -I {} docker rm {}
