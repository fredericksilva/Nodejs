module.exports = {

  database: 'mongodb://dev:dev.1234@ds163387.mlab.com:63387/ecommerce',
  port: 3000,
  secretKey: "L3xy",

  facebook: {
    clientID: process.env.FACEBOOK_ID || '1867827770142364',
    clientSecret: process.env.FACEBOOK_SECRET || '2d19e6d7f75429469f6b79cdd6e47f26',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback'

  }
}
