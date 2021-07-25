
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  try {
    await knex('users').del()
  } catch (e) {
    console.log(e.toString())    
  }
  await knex('users').insert([
    {
      id: 1,
      groups: 'TestGroup',
      orgId: 1,
      username: 'test',
      email: 'test',
      githubId: null,
      password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //NOSONAR
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      smsVerified: 0,
      telegramId: '183535134',
      telegramUsername: 'aaronjxz',
      revoked: '', // if not empty means user has been revoked
      refreshToken: '' // to match user with refreshToken to extend access token
    },
    {
      id: 2,
      groups: 'TestGithub',
      orgId: 1,
      username: 'ais-one',
      email: 'ais-one',
      githubId: 4284574,
      password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //NOSONAR
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      smsVerified: 0,
      telegramId: '183535134',
      telegramUsername: 'aaronjxz',
      revoked: '',
      refreshToken: ''
    },
    {
      id: 3,
      groups: 'TestGmail,TestGroup',
      orgId: 1,
      username: 'aaronjxz',
      email: 'aaronjxz',
      githubId: null,
      password: '$2b$12$Rr1kYTVjZ.9Mnz8EpvRHk.EccoXNtt574A5mwvDn97S5Gu2xIMFhO', //NOSONAR
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      smsVerified: 0,
      telegramId: '183535134',
      telegramUsername: 'aaronjxz',
      revoked: '',
      refreshToken: ''
    }
  ])
}
