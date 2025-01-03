FROM node:20 AS build

WORKDIR /app

RUN apt-get update && apt-get install -y git python3

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod --verbose > build.log 2>&1 && cp build.log /app/build.log

RUN grep -i "error" /app/build.log && exit 1 || exit 0

FROM nginx:latest

COPY --from=build /app/dist/aramex /usr/share/nginx/html

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]