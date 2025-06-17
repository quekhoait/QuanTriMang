const express = require("express");
const sql = require("mssql");
require("dotenv").config();
const app = express();

// SQL Server configuration
var config = {
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false ,// Disable encryption
        trustServerCertificate: true
    }
}

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
  config,
  pool,
  poolConnect
}