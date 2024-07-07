FROM node:18-alpine as build

WORKDIR /app/builder
# Resolve an error with node-gyp
RUN apk add --no-cache --virtual .gyp g++ make py3-pip

COPY . .
RUN yarn

# delete not required
RUN apk del .gyp

RUN yarn build:prod:api

FROM node:18-alpine as final

WORKDIR /app/api

COPY --from=build /app/builder/package*.json .
COPY --from=build /app/builder/node_modules ./node_modules
COPY --from=build /app/builder/yarn*.lock .
COPY --from=build /app/builder/dist/apps/api .

RUN yarn global add pm2

EXPOSE 3000

### pm2 Documentation https://pm2.keymetrics.io/docs/usage/quick-start/
CMD ["pm2-runtime", "start", "main.js"]
