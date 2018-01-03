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
  port: "3000"
  host: 'localhost',
  user: 'root',
  password: 'ugcNHrgm4Y.r',
  database: 'bamazon'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();