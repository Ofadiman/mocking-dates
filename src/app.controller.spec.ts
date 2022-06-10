import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from './app.module'
import { INestApplication } from '@nestjs/common'
import * as supertest from 'supertest'

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
    await app.close()
  })

  it('should get static date from nodejs runtime', async () => {
    const response = await supertest(app.getHttpServer()).get('/get-date-from-nodejs')

    expect(response.body).toEqual({ iso: '2022-06-15T14:00:00.000Z' })
  })

  it('should get static date from database', async () => {
    const response = await supertest(app.getHttpServer()).get('/get-date-from-database')

    expect(response.body).toEqual({ iso: '2022-06-15T14:00:00.000Z' })
  })
})
