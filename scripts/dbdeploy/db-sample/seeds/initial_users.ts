import crypto from 'node:crypto';
import type { Knex } from 'knex';
import { setScryptHash } from '../../../../common/compiled/node/auth/scrypt.js';

export async function seed(knex: Knex): Promise<void> {
  const salt = crypto.randomBytes(16).toString('hex');
  const password = await setScryptHash('test', salt);

  // Deletes ALL existing entries
  try {
    await knex('users').del();
  } catch (e) {
    console.log((e as Error).toString());
  }
  await knex('users').insert([
    {
      id: 1,
      roles: 'TestGroup',
      tenant_id: 1,
      username: 'test',
      email: 'test',
      githubId: null,
      salt: salt,
      password: password,
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      smsVerified: 0,
      telegramId: '183535134',
      telegramUsername: 'aaronjxz',
      revoked: '', // if not empty means user has been revoked
      refreshToken: '', // to match user with refreshToken to extend access token
    },
    {
      id: 2,
      roles: 'TestGithub',
      tenant_id: 1,
      username: 'ais-one',
      email: 'ais-one',
      githubId: 4284574,
      salt: salt,
      password: password,
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      smsVerified: 0,
      telegramId: '183535134',
      telegramUsername: 'aaronjxz',
      revoked: '',
      refreshToken: '',
    },
    {
      id: 3,
      roles: 'TestGmail,TestGroup',
      tenant_id: 1,
      username: 'aaronjxz',
      email: 'aaronjxz',
      githubId: null,
      salt: salt,
      password: password,
      gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
      sms: '6596935500',
      smsVerified: 0,
      telegramId: '183535134',
      telegramUsername: 'aaronjxz',
      revoked: '',
      refreshToken: '',
    },
  ]);
}
