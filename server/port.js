const argv = require('./argv')

require('dotenv').config()

module.exports = parseInt(process.env.PORT || '3000')
