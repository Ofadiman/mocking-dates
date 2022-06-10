import { Controller, Get, OnModuleDestroy } from '@nestjs/common'
import { Pool } from 'pg'

@Controller()
export class AppController implements OnModuleDestroy {
  private pool: Pool = new Pool({
    database: 'postgres',
    host: 'database',
    password: 'postgres',
    min: 1,
    max: 1,
    port: 5432,
    user: 'postgres',
  })

  public async onModuleDestroy() {
    await this.pool.end()
  }

  @Get('get-date-from-nodejs')
  public async hardcoded() {
    return {
      iso: new Date().toISOString(),
    }
  }

  @Get('get-date-from-database')
  public async database() {
    const client = await this.pool.connect()
    const queryResult = await client.query(`SELECT NOW();`)
    client.release()

    return {
      iso: queryResult.rows[0].now,
    }
  }
}
