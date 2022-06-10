FROM node:16.13.0-buster

WORKDIR /

RUN git clone https://github.com/wolfcw/libfaketime.git

WORKDIR /libfaketime/src

RUN make install

RUN mkdir /app

RUN chown -R node:node /app
