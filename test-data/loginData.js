require('dotenv').config();

const fallbackCredentials = {
  username: 'Admin',
  password: 'admin123',
  invalidUsername: 'Adminn',
  invalidPassword: 'admin1234',
};

const logindata = {
  validUser: {
    username: process.env.ORANGE_USERNAME || fallbackCredentials.username,
    password: process.env.ORANGE_PASSWORD || fallbackCredentials.password,
  },
  invalidUser: {
    username: process.env.ORANGE_INVALIDUSERNAME || fallbackCredentials.invalidUsername,
    password: process.env.ORANGE_INVALIDPASSWORD || fallbackCredentials.invalidPassword,
  },
};

module.exports = { logindata };
