//Node modules MySQL and Inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('console.table');

//Variable for MySQL
var connection =  mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"

});

//test connection and launches bamazonCustomer interface
connection.connect(function(err){
    if (err) throw err;
    console.log("connected id: " + connection.threadId);
    displayProducts();
    runBamazon(); //runs bamazon customer inquirer
});

var runBamazon = function () {

    connection.query("SELECT * FROM products", function (err, results){
        if (err) throw err;
    inquirer.prompt([
        {
            type: "input",
            name: "selection",
            message: "Please enter the ID of the product you would like to buy",
            validate: function(value){
                if (value !== null) {
                    return true;
                } else {
                    console.log('You cannot purchase an item without entering the item_id');
                    return false;
                }
            }
        }, {
            type: "input",
            name: "quantity",
            message: "Enter the quantity you would like to purchase",
            default: 1,
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
            }
        }
        ]).then(function(answer){
            //locates selected item from the database and sets it to a variable
            var selectedItem;
            for (var i = 0; i < results.length; i++){
                if (results[i].item_id === parseInt(answer.selection)){
                    selectedItem = results[i];

                }
            }
            //Checks to see if we have order quantity in stock

            var remainder = parseInt(selectedItem.stock_quantity - answer.quantity);
                if (remainder >= 0){
                    var totalPrice = parseInt(answer.quantity * selectedItem.price);
                    console.log("You have purchased " + answer.quantity + " " + selectedItem.product_name + "\nYour total price is: " + totalPrice);
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: remainder
                    }, {
                        item_id: selectedItem.item_id
                    }
                ]);

                } else {
                    console.log('Sorry we only have ' + selectedItem.stock_quantity + " left. Please reduce your order");
                    return false;
                }
        })
    })
};

//displays items for sale
var displayProducts = function () {

    connection.query("SELECT * FROM products", function(err,results){
        if (err) throw err;

    for (var i = 0; i<results.length; i++){
        console.table([
            {
                item_id: results[i].item_id,
                product_name: results[i].product_name,
                department_name: results[i].department_name,
                price: results[i].price,
                stock_quantity: results[i].stock_quantity
            }
        ])
    }


    });

}