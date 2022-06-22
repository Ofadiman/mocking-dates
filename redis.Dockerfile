FROM redis:7.0.2-alpine3.16

RUN apk update
RUN apk add git
RUN apk add make
RUN apk add build-base

WORKDIR /home/redis/

RUN git clone https://github.com/wolfcw/libfaketime.git

WORKDIR /home/redis/libfaketime/src

RUN make install

WORKDIR /data
