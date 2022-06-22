# Mocking dates

A project created to test date mocking in applications running in docker containers. The project uses the `libfaketime` library which intercepts various system calls that programs use to retrieve the current date and time.

# A description of how the Node.js example works

1. I created a custom docker image where I installed the `libfaketime` library and created a `.faketimerc` file which is used to set the date.
2. I have configured the `api` service in the `docker-compose.yml` file where I declared that the date should be taken from the `/home/node/.faketimerc` file located in the docker container.
3. During automated tests, I change the content of the `/home/node/.faketimerc` file by which the date that the `new Date()` call returns changes.

# A description of how the PostgreSQL example works

1. I created a custom docker image where I installed the `libfaketime` library.
2. I have configured the `database` service in the `docker-compose.yml` file where I declared that the date should be taken from the `FAKETIME` environment variable declared in the docker container.
3. During automated tests, I run the `SELECT NOW();` query to return the date that PostgreSQL server sees.

# A description of how the Redis example works

1. I created a custom docker image where I installed the `libfaketime` library.
2. I have configured the `cache` service in the `docker-compose.yml` file where I declared that the date should be taken from the `/home/node/.faketimerc` file located in the docker container.
3. During automated tests, I run the queries against redis cache and validate that the cache is being correctly cleared and set.

# Running tests

In order to test how the library works, I wrote automated tests in the `src/app.controller.spec.ts` file. To run the tests follow these steps:

1. Start the docker containers via the `yarn up` command.
2. Connect to the terminal in the container running the Node.js application via the `yarn shell` command.
3. Run automated tests via the `yarn test` command.

# Conclusion

- Mocking dates in Node.js doesn't seem like the best solution to me. It works, but causes the test runner `Jest` to show incorrect test execution time results (e.g. -720000 seconds). I think that for mocking dates in Node.js it would be better to use the [mockdate](https://www.npmjs.com/package/mockdate) library, as it does not affect the behavior of `Jest` and is simpler to set up.
- Mocking dates in PostgreSQL seems to work without problems and can be a good solution if we want to test SQL queries that use time functions (e.g. `NOW()`).
- Mocking dates in Redis seems to work without problems and can be a good solution if we want to test the application that manages the cache.

# Resources

- [The `libfaketime` project repository on GitHub.](https://github.com/wolfcw/libfaketime)
