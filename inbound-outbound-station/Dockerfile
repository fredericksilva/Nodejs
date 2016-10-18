# Use the predefined node base image for this module.
FROM node:5.11.1

# create the log directory
RUN mkdir -p /var/log/applications/stockstation

# Creating base "src" directory where the source repo will reside in our container.
RUN mkdir /src
WORKDIR /src

# Copy NPM and Bower install files across. We want to allow caching of these commands so that a simple change
# in the source code wont result in an image rebuilding and re-downloading install components.
COPY package.json /src/package.json
COPY bower.json /src/bower.json
COPY .bowerrc /src/.bowerrc

# Tell npm to use our registry
RUN npm set registry http://npm.igbimo.com:4873

# For development environment, we want to use forever to keep the code running
RUN npm install -g forever@0.14.2

# Install node and app dependencies. Move to "storage location" for simple access later.
RUN npm install
# Specific installations required by bamboo and test automation - hence not included in npm install below.
RUN npm install jshint-junit-reporter mocha-bamboo-reporter
RUN mv /src/node_modules /node_modules

RUN npm install -g bower
RUN bower install --allow-root && mv /src/public/components /bower_components

# Code is copied from the host machine to this "src" folder in the container as a last step.
COPY . /src

# Replace node and/or bower. This is done explicitly to prevent the whole "local npm install issues" copies.
RUN rm -rf /src/node_modules && cp -r /node_modules /src/node_modules
RUN rm -rf /src/public/components && cp -r /bower_components /src/public/components

# Map a volume for the log files and add a volume to override the code
VOLUME ["/src", "/var/log/applications/stockstation"]

# Expose web service and nodejs debug port
EXPOSE  8000
EXPOSE  5858

CMD ["forever", "-w", "--debug=5858", "server.js"]
