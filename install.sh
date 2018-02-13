rootDirectory=$(pwd)
cd packages/users-service
serviceName=$(pwd | sed 's#.*/##')

echo "[INSTALL] ${serviceName} microservice: packages dependencies"
# docker build -f Dockerfile.dev -t ${serviceName}.dev .
# docker run --entrypoint '/bin/sh' ${serviceName}.dev -c 'npm run build'
# docker build -t ${serviceName} .
yarn install --silent --non-interactive --no-lockfile
yarn run test
yarn run webpack:prod

# tag image
TAG=0.1.$CIRCLE_BUILD_NUM
# build docker image
docker build -t registry.agenda.ch/fazio/$servicename:$TAG  .
# login to docker hub
docker login registry.agenda.ch -u $USER_DOCKER -p $PASS_DOCKER
# push docker image
docker push registry.agenda.ch/fazio/$servicename:$TAG

cd $rootDirectory
