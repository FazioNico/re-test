FROM node:8.9-alpine
ENV NODE_VERSION 8.9.4
# Create app directory
RUN mkdir -p /usr/users-service/platforms/server
WORKDIR /usr/users-service
# Copy .npm settings and package.json into container
COPY package.json /usr/users-service/package.json
# install dependencies
RUN yarn install --production
# move node_modules folder into the right place
RUN mv /usr/users-service/node_modules /node_modules
# copy source files (or maybe get it from circleci artefact?)
# RUN tar -xvf ~repo/docker-cache/users-service-build.tar -C /usr/users-service
COPY platforms/server /usr/users-service/platforms/server
# expose container port
EXPOSE 3000
# run app in production mode
CMD ["npm", "run", "start"]
