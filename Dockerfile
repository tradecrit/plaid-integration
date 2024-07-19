FROM node:22.2.0-alpine

# Create app directory
RUN apk update && apk add bash

RUN npm install -g npm@latest

ENV USER=app
ENV GROUPNAME=$USER
ENV UID=9999
ENV GID=9999
ENV APP_HOME=/usr/src/app

# Install app dependencies
WORKDIR $APP_HOME

COPY package.json .

RUN npm install
RUN npm install -g typescript

COPY src $APP_HOME/src

RUN tsc src/app.ts --outDir dist

RUN addgroup \
    --gid "$GID" \
    "$GROUPNAME" \
    &&  adduser \
    --disabled-password \
    --gecos "" \
    --home "$(pwd)" \
    --ingroup "$GROUPNAME" \
    --no-create-home \
    --uid "$UID" \
    $USER

RUN chown -R $USER.$USER $APP_HOME

# Bundle app source
USER $USER

EXPOSE 8080

CMD [ "npm", "start" ]