exports.up = async (knex) => {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('groups')
    table.integer('orgId')
    table.string('username')
    table.string('email').unique('email')
    table.integer('githubId').unique('githubId').nullable()
    table.string('password') // hashed
    table.string('role')

    // retry limit
    table.integer('retryLimit', 3)
    table.integer('retryCount', 0)
    table.integer('retryReset', 30) // number of seconds before user can retry

    // authenticators
    table.string('gaKey', 32).comment('Google Authenticator Key')

    // push notification
    table.string('pnToken').defaultTo('')

    table.string('revoked').defaultTo('')
    table.string('refreshToken').defaultTo('')

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
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('users')
}
