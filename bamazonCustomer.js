// REQUIRED MODULES
var mysql = require('mysql');
var inquirer = require("inquirer");

// VARIABLES
var item;
var price;
var itemId;
var itemQuantity;
var quantityChosen;
var total = (price * quantityChosen);

// CONNECT TO SERVER / MYSQL
var connection = mysql.createConnection({
  port: 3306,
  host: 'localhost',
  user: 'root',
  password: 'mysqlpw!',
  database: 'bamazonDB'
});

// Connection Approved or disapproved
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {

});







// connection.end();