FROM node:7.8.0

MAINTAINER Michael Walters, mike@eventbooking.com

RUN apt-get update
RUN apt-get install zip -y

WORKDIR /home

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower

ADD package.json package.json
ADD bin bin
RUN npm install