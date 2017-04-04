FROM node:7.8.0

MAINTAINER Michael Walters, mike@eventbooking.com

RUN apt-get update
RUN apt-get install zip -y

WORKDIR /home

RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower

ADD package.json package.json
RUN npm install

ADD ./bin/wkhtmltopdf /home/bin/wkhtmltopdf
RUN chmod +x /home/bin/wkhtmltopdf

ADD index.js index.js
ADD styles.css styles.css