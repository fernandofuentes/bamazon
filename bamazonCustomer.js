// REQUIRED MODULES
var mysql = require('mysql');
var inquirer = require("inquirer");
var express = require("express");

// VARIABLES
var item;
var price;
var itemId;
var stockQuantity;
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


//function to display all items in store
function display() {

  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, results) {
    if (err) throw err;

    for (var i = 0; i < results.length; i++) {
      id = results[i].item_id;
      item = results[i].product_name;
      price = results[i].price;
      stockQuantity = results[i].stock_quantity;

      console.log("id:" + id + ",", item, "$" + price, "in stock: " + stockQuantity);
    }

    // once you have the items, prompt the user for which they'd like to buy
    inquirer.prompt([{
      name: "item_choice",
      type: "input",
      message: "What is the ID of the product you would like to buy?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }]).then(function(answer) {
      // console.log(answer);

      for (var i = 0; i < results.length; i++) {

        if (answer.item_choice == results[i].item_id) {
          item = results[i].product_name;
          price = results[i].price;
          stockQuantity = results[i].stock_quantity;
        }
      }

      var currentId = answer.item_choice;

      console.log(item);
      console.log("# in Stock:", stockQuantity);
      console.log("price:", price);

      inquirer.prompt([{
        name: "quantity_choice",
        type: "input",
        message: "How many units of the product would you like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }]).then(function(answer) {

        chosenQuantity = parseInt(answer.quantity_choice);

        if (chosenQuantity > stockQuantity) {
          console.log("oops, not enough in stock.");
          console.log("id:" + id + ",", item, "$" + price, "in stock: " + stockQuantity);

          inquirer.prompt([{
            name: "restart",
            type: "confirm",
            message: "Would you like to begin again?",
            default: "yes"
          }]).then(function(answer) {
            if (answer.restart === true) {
              display();
            } else {
              console.log("Thanks for shopping with us!");
            }
          });
        } else {
          console.log('yep, we got enough!');


          updateQuantity(stockQuantity - chosenQuantity, currentId);

          total = (price * chosenQuantity);

          console.log("Your total is: $" + total);

          inquirer.prompt([{
            name: "restart",
            type: "confirm",
            message: "Would you like to begin again?",
            default: "yes"
          }]).then(function(answer) {
            if (answer.restart === true) {
              display();
            } else {
              console.log("Thanks for shopping!");
            }
          });
        }
      });
    });
  });
}

//update function
function updateQuantity(quantity, id) {

  connection.query("UPDATE products SET ? WHERE ?", [{
    "stock_quantity": quantity
  }, {
    "item_id": id
  }], function(err, results) {
    if (err) throw err;
  });
};