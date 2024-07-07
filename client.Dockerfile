FROM node:18-alpine as build

WORKDIR /app/builder
# Resolve an error with node-gyp
RUN apk add --no-cache --virtual .gyp g++ make py3-pip

COPY . .
RUN yarn

# delete not required
RUN apk del .gyp

RUN yarn build:prod:client

FROM nginx:alpine as final

WORKDIR /usr/share/nginx/html
COPY --from=build /app/builder/dist/apps/client .
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
