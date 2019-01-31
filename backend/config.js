module.exports = {
  USE_OTP: process.env.USE_OTP || '',
  KEY_EXPIRY: process.env.KEY_EXPIRY || '15m',
  SECRET_KEY: process.env.SECRET_KEY || '123456789',
  OTP_SECRET_KEY: process.env.OTP_SECRET_KEY || '987654321',

  API_PORT: process.env.API_PORT || 3000,
  USE_HTTPS: process.env.USE_HTTPS || false, // USE_HTTPS should be path to letsencrypt location OR false 
  WS_PORT: process.env.WS_PORT || 3001,
}
// process.env.KEYV_CACHE
// process.env.MONGO_URL
// OTP_SERVICE_NAME
// TELEGRAM_BOT_ID=
// TELEGRAM_API_KEY=
