rootDirectory=$(pwd)
cd packages/users-service
serviceName=$(pwd | sed 's#.*/##')

echo "[INSTALL] ${serviceName} microservice: packages dependencies"
docker build -f Dockerfile.dev -t ${serviceName}.dev .
docker run --entrypoint '/bin/sh' ${serviceName}.dev -c 'npm run build'
docker build -t ${serviceName} .

cd $rootDirectory
#
