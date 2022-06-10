FROM postgres:14.2-alpine

RUN apk update
RUN apk add git
RUN apk add make
RUN apk add build-base

WORKDIR /

RUN git clone https://github.com/wolfcw/libfaketime.git

WORKDIR /libfaketime/src

RUN make install

WORKDIR /
