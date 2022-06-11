# Mocking dates

A project created to test date mocking in applications running in docker containers. The project uses the `libfaketime` library which intercepts various system calls that programs use to retrieve the current date and time.

# Node.js example

The first example is a REST endpoint accessible at `http://localhost:3000/get-date-from-nodejs` that calls the `Date` constructor in Node.js.

- An example of installing the `libfaketime` library in a docker image can be found in the `node.Dockerfile`.
- An example of configuring the library so that any call to `new Date()` always returns the date `2022-06-15T14:00:00.000Z` can be found in `docker-compose.yml`.

# PostgreSQL example

The second example is the use of the library when running the PostgreSQL database server. Thanks to the `libfaketime` library, any function call such as `NOW()` will always return the same date.

- An example of installing the `libfaketime` library in a docker image can be found in the `postgres.Dockerfile`.
- An example of configuring the library so that any call to `new Date()` always returns the date `2022-06-15T14:00:00.000Z` can be found in `docker-compose.yml`.

# Running tests

In order to test how the library works, I wrote automated tests in the `src/app.controller.ts` file. To run the tests follow these steps:

1. Start the docker containers via the `yarn up` command.
2. Connect to the terminal in the container running the Node.js application via the `yarn shell` command.
3. Run automated tests via the `yarn test` command.

# Resources

- [The `libfaketime` project repository on GitHub.](https://github.com/wolfcw/libfaketime)
