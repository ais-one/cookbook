
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          orgId: 1,
          username: 'test',
          email: 'test',
          password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', // test
          gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
          sms: '6596935500',
          // smsLastSent
          // smsOtpPin
          smsVerified: 0,    
          telegramId: '183535134',
          telegramUsername: 'aaronjxz'
        }
      ])
    })
}
