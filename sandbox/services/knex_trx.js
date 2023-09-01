const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'test_db'
  }
})


/*
CREATE TABLE `test_table` (
	`id` INT(10,0) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `unique_name` (`name`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=10
;
*/

async function test() {
  try {
    console.log('read uncommitted')

    // empty data
    await knex('test_table').truncate()

    console.log('See Transaction...')
    await knex.transaction(async trx => {  
      await knex('test_table').insert({ name: 'aa' }).transacting(trx)
      // await knex.schema.raw('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;')
      let rv = await knex.select().from('test_table')
      console.log(rv)

      await knex('test_table').insert({ name: 'bb' }).transacting(trx)
      await knex.schema.raw('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;')
      rv = await knex.select().from('test_table')
      console.log(rv)

      await knex('test_table').insert({ name: 'cc' }).transacting(trx)
      // await knex.schema.raw('SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;')
      rv = await knex.select().from('test_table')
      console.log(rv)
    })

    console.log('state check...')
    let rv0 = await knex.select().from('test_table')
    console.log(rv0)

    console.log('Generate error in transaction...')
    await knex.transaction(async trx => {  
      await knex('test_table').insert({ name: 'dd' }).transacting(trx)
      await knex('test_table').insert({ name: 'aa' }).transacting(trx)
    })  
  } catch (e) {
    console.error(e.toString())
  }

  console.log('Final snapshot...')
  try {
    let rv = await knex.select().from('test_table')
    console.log(rv)
  } catch (e) {
    console.error(e.toString())
  }
  process.exit(0)
}

test()
