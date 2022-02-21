const mysql = require('mysql')
require('dotenv').config()

const googleDatabase = {
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  multipleStatements: true
}

class Connection {
  constructor() {
    if (!this.pool) {
      console.log('creating connection...')
      this.pool = mysql.createPool({
        connectionLimit: 100,
        ...googleDatabase
      })

      return this.pool
    }

    return this.pool
  }
}

const instance = new Connection()

module.exports = instance;