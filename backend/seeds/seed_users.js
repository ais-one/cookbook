
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
          githubId: null,
          password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', // test
          gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
          sms: '6596935500',
          // smsLastSent
          // smsOtpPin
          smsVerified: 0,    
          telegramId: '183535134',
          telegramUsername: 'aaronjxz'
        },
        {
          id: 2,
          orgId: 1,
          username: 'ais-one',
          email: 'ais-one',
          githubId: 4284574,
          password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', // test
          gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
          sms: '6596935500',
          // smsLastSent
          // smsOtpPin
          smsVerified: 0,    
          telegramId: '183535134',
          telegramUsername: 'aaronjxz'
        },
        {
          id: 3,
          orgId: 1,
          username: 'aaronjxz',
          email: 'aaronjxz',
          githubId: null,
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
