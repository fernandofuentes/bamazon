//global variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var express = require("express");

var item;
var price;
var id;
var department_name;
var stockQuantity;
var chosenQuantity;
var total = (price * chosenQuantity);


// MYSQL Login

var connectObject = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpw!",
  database: "bamazonDB2"
};

var connection = mysql.createConnection(connectObject);

connection.connect(function(error) {
  if (error) {
    throw error;
  }
  display();
});

// A function to disply all products in Bamazon
function display() {

  connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(error, results) {
    if (error) throw error;
    // Display Welcome Messages to the Buyer
    console.log("==============================================");
    console.log("WELCOME TO BANANZA! SPEND ALL YOUR MONEY HERE!");
    console.log("==============================================");

    // forLoop for all PRODUCTS
    for (var i = 0; i < results.length; i++) {
      id = results[i].item_id;
      item = results[i].product_name;
      department_name = results[i].department_name;
      price = results[i].price;
      stockQuantity = results[i].stock_quantity;

      console.log("ID #: " + id + ", " + item + ", " + "Department: " + department_name + ", " + "$" + price + ", " + "# In Stock: " + stockQuantity);
    }
    // Space ....
    console.log(" ")

    // What is the ID of the product you would like to buy?
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

      for (var i = 0; i < results.length; i++) {

        if (answer.item_choice == results[i].item_id) {
          item = results[i].product_name;
          price = results[i].price;
          stockQuantity = results[i].stock_quantity;
        }
      }

      var currentId = answer.item_choice;
      console.log("====================");
      console.log(item);
      console.log("# IN STOCK: " + stockQuantity);
      console.log("PRICE: $" + price + " each");
      console.log("====================");

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
          console.log("SORRY! We don't have enough in stock");
          console.log("id:" + id + "," + item + "$" + price + "in stock: " + stockQuantity);

          inquirer.prompt([{
            name: "restart",
            type: "confirm",
            message: "Would you like to continue shopping?",
            default: "yes"
          }]).then(function(answer) {
            if (answer.restart === true) {
              display();
            } else {
              console.log("=======================================");
              console.log("Thankyou for shopping with us!");
              console.log("=======================================");
            }
          });
        } else {
          // SUBTRACT QUANTITY FROM STOCK
          // ADD UP THE TOTAL
          updateQuantity(stockQuantity - chosenQuantity, currentId);

          total = (price * chosenQuantity);

          console.log("Your total is: $" + total);

          inquirer.prompt([{
            name: "restart",
            type: "confirm",
            message: "Would you like to continue shopping?",
            default: "yes"
          }]).then(function(answer) {
            if (answer.restart === true) {
              display();
            } else {
              console.log("===============================");
              console.log("Thank you for shopping with us!");
              console.log("===============================");
            }
          });
        }
      });
    });
  });
} // end display function

//update function
function updateQuantity(quantity, id) {

  connection.query("UPDATE products SET ? WHERE ?", [{
    "stock_quantity": quantity
  }, {
    "item_id": id
  }], function(err, results) {
    if (err) throw err;
  });
} //end update function