FROM node:16.13.0-buster

# Set the working directory at docker image build time to the home folder of the default image user.
WORKDIR /home/node

# Clone the source files of the time mocking library.
RUN git clone https://github.com/wolfcw/libfaketime.git

# Go to the directory that contains the Makefile needed to build and install the library.
WORKDIR /home/node/libfaketime/src

# Build and install the library.
RUN make install

# Create a directory where the Node.js application will reside.
RUN mkdir /home/node/app

# The libfaketime library allows you to use a file named `.faketimerc` to dynamically change the time at runtime.
# I have to create this file manually.
#RUN touch /home/node/.faketimerc
RUN echo "2022-06-15 14:00:00" > /home/node/.faketimerc

# The default owner of the file is `root` by which it cannot be edited in the docker container.
# Here I change the file owner so that I can edit the file from within e.g. Node.js, terminal.
RUN chown node:node /home/node/.faketimerc
