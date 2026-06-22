require('dotenv').config();
const logindata = {
    validUser:{
        username: process.env.ORANGE_USERNAME,
        password : process.env.ORANGE_PASSWORD
    },
    invalidUser: {
       username: process.env.ORANGE_INVALIDUSERNAME,
       password: process.env.ORANGE_INVALIDPASSWORD
        //password: 'admin1234'
    }
};

module.exports = { logindata };