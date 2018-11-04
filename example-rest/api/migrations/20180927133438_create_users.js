
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.integer('orgId')
      table.string('username')
      table.string('email').unique('email')
      table.string('password') // hashed
      table.string('role')

      // retry limit
      table.integer('retryLimit', 3)
      table.integer('retryCount', 0)
      table.integer('retryReset', 30) // number of seconds before user can retry

      // authenticators
      table.string('gaKey', 32).comment('Google Authenticator Key')

      // SMS number
      table.string('sms')
      table.dateTime('smsLastSent')
      table.string('smsOtpPin', 6)
      table.integer('smsVerified') // need to verify sms

      // telegram
      table.string('telegramId')
      table.string('telegramUsername')
      // table.timestamps() // createdAt, updatedAt
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
};
