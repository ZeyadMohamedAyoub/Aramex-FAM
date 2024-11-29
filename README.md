A bash script for running all the docker commands:
-------------------------------------------------
`./runscript.sh`

`docker build -t aramex-frontend .`

`docker run -d -p 4000:4000 aramex-frontend`

`docker build -t aramex-backend .`

`docker run -d -p 8000:8000 -e MONGO_URL='*********unsharable********' aramex-backend`

 Verify Containers Are Running: <it is already in the bash script>
 
`docker ps`

docker logs <backend-contr-id || frontend-contr-id>


