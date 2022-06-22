import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from './app.module'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'
import * as fs from 'node:fs'
import { redisClient, service } from './app.controller'

describe('Mocking dates', () => {
  let app: INestApplication

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = testingModule.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await redisClient.flushDb() // Clear all cached data.
    await app.close()
    fs.writeFileSync('./redis.faketimerc', '2022-06-15 14:00:00') // Restore the default time that Redis server sees.
  })

  beforeEach(() => {
    fs.writeFileSync('/home/node/.faketimerc', '2022-06-15 12:00:00')
  })

  afterEach(() => {
    fs.writeFileSync('/home/node/.faketimerc', '2022-06-15 12:00:00')
  })

  it('should get static date from nodejs runtime', async () => {
    const response = await supertest(app.getHttpServer()).get('/get-date-from-nodejs')

    expect(response.body).toEqual({ iso: '2022-06-15T10:00:00.000Z' })
  })

  it('should get static date from database', async () => {
    const response = await supertest(app.getHttpServer()).get('/get-date-from-database')

    expect(response.body).toEqual({ iso: '2022-06-15T14:00:00.000Z' })
  })

  it('should get updated date from nodejs runtime', async () => {
    const response = await supertest(app.getHttpServer()).get('/get-date-from-nodejs')

    expect(response.body).toEqual({ iso: '2022-06-15T10:00:00.000Z' })

    fs.writeFileSync('/home/node/.faketimerc', '2022-06-19 16:00:00')

    const responseAfterDateUpdate = await supertest(app.getHttpServer()).get(
      '/get-date-from-nodejs',
    )

    expect(responseAfterDateUpdate.body).toEqual({ iso: '2022-06-19T14:00:00.000Z' })
  })

  it('should check if cached is properly cleared and setup', async () => {
    const performExpensiveOperationSpy = jest.spyOn(service, 'performExpensiveOperation')

    /**
     * During the first request, the cache is empty, so I expect the `performExpensiveOperation` function is called.
     */
    const firstResponse = await supertest(app.getHttpServer()).get('/get-item-from-redis')

    expect(firstResponse.body).toEqual({ value: 'compute' })
    expect(performExpensiveOperationSpy).toHaveBeenCalledTimes(1)

    /**
     * I change the time the Redis server sees by 5 seconds forward.
     */
    fs.writeFileSync('./redis.faketimerc', '2022-06-15 14:00:05')

    /**
     * During the second request, the redis server has the cached value, so I expect the `performExpensiveOperation` function is not called 1 more time.
     */
    const secondResponse = await supertest(app.getHttpServer()).get('/get-item-from-redis')

    expect(secondResponse.body).toEqual({ value: 'compute' })
    expect(performExpensiveOperationSpy).toHaveBeenCalledTimes(1)

    /**
     * I change the time the Redis server sees by 1 more second.
     */
    fs.writeFileSync('./redis.faketimerc', '2022-06-15 14:00:06')

    /**
     * During the third request, the redis should delete the value from the cache, so I expect the `performExpensiveOperation` function to be called 1 more time.
     */
    const thirdResponse = await supertest(app.getHttpServer()).get('/get-item-from-redis')

    expect(thirdResponse.body).toEqual({ value: 'compute' })
    expect(performExpensiveOperationSpy).toHaveBeenCalledTimes(2)
  })
})
