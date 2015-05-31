FROM mhart/alpine-iojs:2.1.0
RUN apk add --update git && rm -rf /var/cache/apk/*
WORKDIR /src
COPY . /src
RUN npm install
RUN npm install -g grunt-cli bower
RUN bower install --allow-root
