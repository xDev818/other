require("dotenv").config();
var mysql = require("mysql2");

function Comments_Nole() {
  // Date : 10/12/23
  // Author : Nole
  // Activities
  // Purpose : Create new database.js class
  //           Initiate the DB Connection
  //           var connection = mysql.createConnection( {.. }
  //
  // Date :
  // Author :
  // Activities
  // Purpose :
}

 var connection = mysql.createConnection({
   host: 'localhost',
   database: 'assetsmanagement',
   user: 'root',
   password: 'localhost123@',
 });

module.exports = connection;
