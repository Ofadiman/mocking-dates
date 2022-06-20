import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";
import * as supertest from "supertest";
import * as fs from "node:fs";

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
})
