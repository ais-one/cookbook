'use strict'
const typeorm = require("typeorm");

async function resetUserRolePermission (connection) {
  try {
    // For SQLite
    await connection.manager.query('DELETE FROM role_permission')

    await connection.manager.query('DELETE FROM user')
    await connection.manager.query(`DELETE FROM sqlite_sequence where name='user'`)

    await connection.manager.query('DELETE FROM role')
    await connection.manager.query(`DELETE FROM sqlite_sequence where name='role'`)

    await connection.manager.query('DELETE FROM permission')
    await connection.manager.query(`DELETE FROM sqlite_sequence where name='permission'`)

    let data

    await connection.manager.createQueryBuilder().insert().into('permission').values([
      { id: null, name: 'view_users' },
      { id: null, name: 'edit_users' },
      { id: null, name: 'view_roles' },
      { id: null, name: 'edit_roles' },
      { id: null, name: 'view_products' },
      { id: null, name: 'edit_products' },
      { id: null, name: 'view_orders' },
      { id: null, name: 'edit_orders' }
    ]).execute();
    data = await connection.manager.query('select * from permission')
    console.log(data)

    await connection.manager.createQueryBuilder().insert().into('role').values([
      { id: null, name: 'Admin' },
      { id: null, name: 'Customer' },
    ]).execute();
    data = await connection.manager.query('select * from role')
    console.log(data)

    await connection.manager.createQueryBuilder().insert().into('role_permission').values([
      { role_id: 1, permission_id: 1 }, // Admin Role
      { role_id: 1, permission_id: 2 },
      { role_id: 1, permission_id: 3 },
      { role_id: 1, permission_id: 4 },
      { role_id: 1, permission_id: 5 },
      { role_id: 1, permission_id: 6 },
      { role_id: 1, permission_id: 7 },
      { role_id: 1, permission_id: 8 },
      { role_id: 2, permission_id: 5 }, // Customer Role
      { role_id: 2, permission_id: 7 },
      { role_id: 2, permission_id: 8 },
    ]).execute();
    data = await connection.manager.query('select * from role_permission')
    console.log(data)

    // password is "password"
    await connection.manager.createQueryBuilder().insert().into('user').values([
      { id: null, email: 'admin@test.com', first_name: 'adm', last_name: 'min', password: '$2a$12$UvrhmK5FxI7FJHEJVu61aOMEKhIV4QVk5njjgwNZqeEROisnRJMLS', role_id: 1 }
    ]).execute();
    data = await connection.manager.query('select * from user')
    console.log(data)
  } catch (e) {
    console.log(e.toString())
  }
}

async function seedProduct (connection) {
  try {
    // For SQLite
    await connection.manager.query('DELETE FROM "product"') // reserved word
    await connection.manager.query(`DELETE FROM sqlite_sequence where name='product'`)

    await connection.manager.createQueryBuilder().insert().into('product')
      .values([
        { id: null, title: 't1', description: 'some t1', image: 'http://lorempixel.com/400/200/', price: 10 },
        { id: null, title: 't2', description: 'some t2', image: 'http://lorempixel.com/200/200/', price: 20 },
      ])
      .execute();
    const data = await connection.manager.query('select * from "product"') // reserved word
    console.log(data)
  } catch (e) {
    console.log(e.toString())
  }
}

async function seedOrder (connection) {
  try {
    // For SQLite
    await connection.manager.query('DELETE FROM order_item')
    await connection.manager.query(`DELETE FROM sqlite_sequence where name='order_item'`)
    await connection.manager.query('DELETE FROM "order"') // reserved word
    await connection.manager.query(`DELETE FROM sqlite_sequence where name='order'`)

    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() + 2)

    console.log(today)
    console.log(yesterday)

    await connection.manager.createQueryBuilder().insert().into('order')
      .values([
        { id: null, first_name: 'waar', last_name: 'onjxz', email: 'aa3', created_at: today.toISOString() },
        { id: null, first_name: 'bb1a', last_name: 'bb2a', email: 'bb3', created_at: yesterday.toISOString() },
        { id: null, first_name: 'cc1', last_name: 'cc2', email: 'cc3', created_at: today.toISOString() },
      ])
      .execute();
    const data = await connection.manager.query('select * from "order"') // reserved word
    console.log(data)

    await connection.manager.createQueryBuilder().insert().into('order_item')
      .values([
        { id: null, product_title: 't1', price: 10, quantity: 1, order_id: 1 },
        { id: null, product_title: 't2', price: 20, quantity: 2, order_id: 1 },
        { id: null, product_title: 't1', price: 10, quantity: 3, order_id: 2 },
        { id: null, product_title: 't2', price: 20, quantity: 4, order_id: 2 },
        { id: null, product_title: 't1', price: 10, quantity: 1, order_id: 3 },
      ])
      .execute();
    const data2 = await connection.manager.query('select * from order_item')
    console.log(data2)
  } catch (e) {
    console.log(e.toString())
  }
}

async function run () {
  const connection = await typeorm.createConnection({
    type: "sqlite",
    database: 'db.sqlite',
    synchronize: false,
    logging: false
  })
  // await seedProduct(connection)
  // await seedOrder(connection)
  await resetUserRolePermission(connection)
}

run();

// await manager;


// const manager = getManager()
// const photosSums = await manager
//     .createQueryBuilder()
//     .select("user.id")
//     .from("user")
//     .addSelect("SUM(user.photosCount)", "sum")
//     .groupBy("user.id")
//     .getRawMany();

// result will be like this: [{ id: 1, sum: 25 }, { id: 2, sum: 13 }, ...]