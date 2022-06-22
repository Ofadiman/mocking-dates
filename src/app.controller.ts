import { Controller, Get, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Pool } from 'pg'
import { createClient } from 'redis'

export const service = {
  performExpensiveOperation: async () => 'compute',
}

export const pool: Pool = new Pool({
  database: 'postgres',
  host: 'database',
  password: 'postgres',
  min: 1,
  max: 1,
  port: 5432,
  user: 'postgres',
})

export const redisClient = createClient({
  url: `redis://cache:6379`,
})

@Controller()
export class AppController implements OnModuleDestroy, OnModuleInit {
  public async onModuleDestroy() {
    await pool.end()
    await redisClient.disconnect()
  }

  public async onModuleInit() {
    await redisClient.connect()
  }

  @Get('get-date-from-nodejs')
  public async hardcoded() {
    return {
      iso: new Date().toISOString(),
    }
  }

  @Get('get-date-from-database')
  public async database() {
    const client = await pool.connect()
    const queryResult = await client.query(`SELECT NOW();`)
    client.release()

    return {
      iso: queryResult.rows[0].now,
    }
  }

  @Get('get-item-from-redis')
  public async cache() {
    let value = await redisClient.get('test')
    console.log(`Value in cache: ${value}.`)

    if (value === null) {
      console.log(
        `Value is not in the cache. Providing a new value and setting it in the cache for 5 seconds.`,
      )

      /**
       * Here I simulate some query that is costly.
       */
      value = await service.performExpensiveOperation()

      await redisClient.set('test', value, { EX: 5 })
    }

    return { value }
  }
}
