# Stock Station Frontend Tool #

The repository for Konga's Stock Station Frontend Tool. This service will act as a user interface for the StockRequest Service and SAP.

## Development Environment

### Debugging

See the Wiki pages (below) for instructions on debugging NodeJS apps:

Using PhpStorm: https://kongaonline.atlassian.net/wiki/display/SOA/Node.JS+Development#Node.JSDevelopment-setting-up-development-environment

Using Node-Inspector inside Docker: https://kongaonline.atlassian.net/wiki/display/SOA/Node.JS+Development#Node.JSDevelopment-debugging-with-node-inspector


### Docker

#### Starting Containers

This project has been setup to use docker to create a development environment. The readme assumes docker version 1.9.1 installed on your system.

The project contains bash scripts to simplify the interaction with docker and enable dynamic code changes. These can be found in

```
<project_root>/bin
```

To start up all the different docker containers, which will include everything specified in the various docker compose files, run the following command in the project root:

```
./bin/start_all.sh
```

The command will attempt to start up containers based on specific images. If the images cannot be found, it will be downloaded automatically.
If the project's image cannot be found, it will be built from the Dockerfile automatically.

When all is complete, you will be given a printout showing you your running containers. Part of the printout should contain something like this:

```
.....   0.0.0.0:32913->6379/tcp     stockstation_redis
.....   0.0.0.0:32914->3306/tcp     stockstation_mysql
.....   0.0.0.0:32914->8125/udp     stockstation_statsd
.....   0.0.0.0:32920->8080/tcp     stockstation_web_app
```

This tells you that the various machines exist "locally" at 0.0.0.0 and that the exposed ports have been mapped to port 32913 for the redis container, 32914 for the mysql container and 32920 for the Base API web app container. Again, these are examples - the actual values and machine names for your services may differ.

Now, if using Docker Machine you can lookup the ip address of your docker host by issuing the following command:

```
docker-machine ip default
```

Which will return the IP address of the machines where the images run. For example: ```192.168.99.100```

Therefore, from above examples, your started web-app (stockrequestservice_web_app) can be found at: ```192.168.99.100:32920```

The following URL should be accessible after running the application (Assuming that you are running the web-app in a Docker container, given examples above):

    http://192.168.99.100:32920/v1/example

And expect a response as follows:

    {"status":"error","code":"E0001","message":"Access Denied"}

Thus your adventure begins... You need a proper authentication token to progress further. The BaseAPI is functioning.

#### Stopping Containers

To stop the docker development environment, issue the following command from the project root:

```
./bin/stop_all.sh
```

This will stop all containers related to this project.

#### Cleaning Images

To clean up built project images, run the following command from root:

```
./bin/clean.sh
```

This will stop and remove all containers associated with the relevant project images, then remove the image itself. The clean action is useful if you want the docker image to be rebuilt (for whatever reason).

#### Disposable Container

The most powerful part of docker is our disposable containers. The disposable container is an instance of your docker image, connected to all the relevant docker containers used for the service's infrastructure, in order to allow testing and dynamic changes of the code base.

To start up and connect to a disposable container instance, run this from the project root:

```
./bin/start_disposable.sh
```

This command will start up all required infrastructure containers, and build images, in order to get you to a point where you are connected inside a disposable container.

You will be connected to the /src folder inside the container. The source code is a mapping of your own source code folder on your host, so any changes to the code on the host machine will be reflected on the docker container and vice versa.

The container will also link in a running web-app container (or whatever a project requires for full regression testing) should such a container instance be running. If nothing is running, it will only connect to the infrastructure containers.


### Environmental Variables

The project's environmental variables (for the development environment) are stored in a `.env` file in the project root. This file is intended for use during docker container creation.

Note that things like REDIS and MYSQL IPs and Ports are handled by docker linking env vars, but should they not be linked in via docker, you can provide an alternative in this file.


## Developer Commands

The below commands assume that a disposable docker container (for this service) has been started up and that you are working inside that container.
``NB``: The disposable container assumes that a appropriate .env exists with correct port exposures. If not, your service may not be reachable from the host machine.

### Required Packages and Server

Install the dependencies:

    npm install

Start the application:

    node server.js

OR by using PM2:

    npm start

PM2 is more suitable for development environment as it monitors file updates and restarts the service.

### Tests

All tests should be added to the **/test** folder in your project. The test framework used is Mocha, and the code coverage tool is Istanbul.

The following command can be run to use the example test which should output success:

    istanbul cover _mocha -- -R spec

Note that no code coverage will be processed until code in the project is called by the test.

More information regarding tests can be found at [http://mochajs.org/](http://mochajs.org/ "Mocha Test Framework") and [http://sinonjs.org/](http://sinonjs.org/ "Sinon JS").
