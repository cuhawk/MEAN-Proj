# cuhawkMean

> Author [Renaud Racinet](mailto:racinet.renaud@orange.fr)<br />
> Powered by [Nx](https://nx.dev), [Angular](https://angular.io) and [NestJs](https://nestjs.com/)
> Context: Technical Test

# Summary
* [Statement Of Test](#statement-of-test)
  * [French Version](#original-version)
  * [English Version](#english-version)
* [Structure Project](#structure-project)
* [Project Dependencies](#project-dependencies)
* [Command in Line](#command-in-Line)
  * [Build]() 

# Statement Of Test
[back to top](#summary)

## Original Version

> cuhawk est en train de développer une solution de chat avec des bots et entre humains. Ainsi,
vous êtes demandé de créer une application de chat en temps réel.
>
> ### Technologies recommandées
>
>* NodeJS
>* [Socket.io](https://socket.io)
>* Angular/React
>* Docker
>
>### Description de l'application à développer
>
>L'application à développer est une application web de chat simplifiée.
Les fonctionnalités à développer sont :
>
> * [x] Créer une salle de chat
> * [x] Afficher l'ID de la salle avec un bouton pour le copier dans le presse-papier
> * [x] Joindre une salle de chat
>   * [x] Fournir l'ID de la salle à joindre
>   * [x] Fournir le pseudonyme à utiliser pour envoyer les messages
> * [x] Envoyer un message dans une salle de chat
> * [x] Lire les messages des autres personnes dans la salle de chat en cours, en temps réel
> * [ ] Plusieurs personnes peuvent joindre la même salle de chat. Limité à 10 personnes en
même temps.
>
>### Contraintes
>
>Le code développé doit respecter les contraintes suivantes :
>
>* Tests unitaires et End-to-end
>* Documentation du code
>* Gestion des erreurs
>* Separation of concerns
>* Respect des standards de la communauté JS
>* Traçabilité
>* Containerisation

## English version

> cuhawk is developing a chat solution with bots and between humans. Thus,
you are asked to create a real-time chat application.
>
> ### Recommend Technologies
>
>* NodeJS
>* [Socket.io](https://socket.io)
>* Angular/React
>* Docker
>
> ### App Description to develop
> The application to develop is a simplified web chat application.
> 
> The features to be developed are :
> 
> * [x] Create a chat room.
> * [x] Display the room ID with a button to copy it to the clipboard.
> * [x] Join a chat room.
>     * [x] Provide the room id to join.
>     * [x] Provide the nickname to be used to send message. 
> * [x] Send a message in a chat room
> * [x] Read messages from other people in the current chat room, in real time
> * [ ] Several people can join the same chat room. Limited to 10 people at the same
    at the same time.
> 
> ### Constraints
> 
> The developed code must respect the following constraints:
> * Unit and end-to-end tests
> * Code documentation
> * Error handling
> * Separation of concerns
> * Respect of the JS community standards
> * Traceability
> * Containerization

# Structure Project
[back to top](#summary)

| Project Name [libs] | Description (Framework)                                                           | Folder Name        | Library Folders Name                                      |
|--------------------:|:----------------------------------------------------------------------------------|:-------------------|:----------------------------------------------------------|
|                 api | API REST (Nestjs)                                                                 | apps/**api**       | libs/**chat**                                             |
|              client | Web App (Angular)                                                                 | apps/**client**    | lib/**ui**, lib/**chat-room**                             |
|          [abstract] | Sharing abstract class, class and type                                            | libs/**abstract**  | lib/abstract/**class**, lib/abstract/**type**             |
|          [constant] | Constant shared and shared config between project or component                    | libs/**constant**  |                                                           |
|            [styles] | Styles folders with shared SCSS files                                             | libs/**styles**    |                                                           |
|              [chat] | Component (Nestjs) which contains websocket gateway and all logics                | libs/**chat**      |                                                           |
|         [chat-room] | Components (Angular) which contain chat interface for create and join a chat room | libs/**chat-room** | libs/src/lib/**create-chat**, libs/src/libs/**join-chat** |
|                [ui] | Template interface (Angular) with redundant components                            | libs/**ui**        | libs/ui/lib/**header**                                    |
|              [home] | Home component (Angular)                                                          | libs/**home**      | 

> For understand topology please use the command:
> ```bash
> yarn dep-graph
> ```
> 
> or
> 
> ```bash
> yarn graph
> ```

# Project Dependencies
[back to top](#summary)

|    Name | Dependencies   |       SubDependencies        | link                                                                                                  |
|--------:|:---------------|:----------------------------:|:------------------------------------------------------------------------------------------------------|
| Angular | @nrwl/angular  | @angular/cli, @angular/core… | [Angular CLI doc](https://angular.io/cli),<br /> [@nrwl/angular doc](https://nx.dev/packages/angular) |
|    Nest | @nrwl/nest     |         @nestjs/cli…         | [Nestjs CLI doc](https://docs.nestjs.com/cli/overview), [@nrwl/nest](https://nx.dev/packages/nest)    |
 
# Command In Line
[back to top](#summary)

## Install dependencies

> yarn was installed by default. For use `npm`, you must delete `yarn.lock` and install dependencies with `npm i`. This readme files describe only command with `yarn` command.   

```bash
yarn
```

## Default command

With nx project you must use @nrwl/<PACKAGES_NAME> and its own commands, just a little different of command framework usually used. Such as:

![Command Line by default](https://user-content.gitlab-static.net/56d855b0e6aef8cca40fba7a7634b1691f36b77b/68747470733a2f2f6e782e6465762f646f63756d656e746174696f6e2f7368617265642f616e67756c61722d7475746f7269616c2f72756e2d7461726765742d73796e7461782e737667)


For see `Project Name` used, report to table at [Project Structure Unit](#structure-project)

## Build
[back to top](#summary)

For build all projects
```bash
nx run-many -t build
```

For build one project
```bash
nx build <PROJECT_NAME>
```

For see PROJECT_NAME please report Project Name of [Structure Project](#structure-project).

## Development
[back to top](#summary)

### Start your project
For this stack you can run front-end and back-end respectively with:

```bash
yarn start:dev:client
```

Front-end with angular runs on `http://loclahost:4200` by default.

```bash
yarn start:dev:api
```

### Generate components

For generate a new **component** or **container**
![generate a new component](https://nx.dev/documentation/shared/angular-standalone-tutorial/generator-syntax.svg)

For see `generator name`, it `default option` and `other options` for

* [Nestjs](https://nx.dev/packages/nest/generators)
* [Angular](https://nx.dev/packages/angular/generators)

Back-end with Nestjs runs on `http://loclahost:8000` by default.

For the launch of all projects, please follow this line:
```bash
yarn start:dev
```

## Production
[back to top](#summary)

You must use add a nginx.conf into root of this repository like:
```
server {
  listen 80;
  sendfile on;
  default_type application/octet-stream;

  gzip on;
  gzip_http_version 1.1;
  gzip_disable      "MSIE [1-6]\.";
  gzip_min_length   256;
  gzip_vary         on;
  gzip_proxied      expired no-cache no-store private auth;
  gzip_types        text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
  gzip_comp_level   9;

  root /usr/share/nginx/html;

  location / {
    try_files $uri $uri/ /index.html =404;
  }
}
```

client.DockerFile
```Dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

WORKDIR /usr/share/nginx/html
COPY ./dist/apps/client .
```

api.Dockerfile
```Dockerfile
# Build image for transpile in javascript. 
FROM node:18-alpine as build

WORKDIR /app/builder
# Resolve an error with node-gyp
RUN apk add --no-cache --virtual .gyp g++ make py3-pip

COPY . .
RUN yarn

# delete not required
RUN apk del .gyp

RUN yarn build:prod:api

# Final image with only javascript files.
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
```

It used pm2, for monitoring.

>
> At below original documentation by default on nx project without duplicates.
>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Remote caching
Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help
Visit the [Nx Documentation](https://nx.dev) to learn more.
