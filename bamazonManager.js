
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.


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
    managerSelections();

});

//Inquirer prompt for
var managerSelections = function (){
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "How would you like to proceed?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            default: "View Products for Sale"
        }
    ]).then(function(answer){

        //Switch statement to run functions based on Manager prompt answers
        switch (answer.selection){
            case "View Products for Sale":
                displayProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            default:
                console.log("Please select an option");
        }
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

        managerSelections();
    });

};

var lowInventory = function (){
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN ? and ?",[0,100], function(err, results) {

        if (results <= 0) {
            console.log('\nAll items are stocked adequately');
            managerSelections();
        } else{

            for (var i = 0; i < results.length; i++) {
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
            managerSelections();
         }
    });

};

var addInventory = function(){
    connection.query("SELECT * FROM products", function(err, results){
        inquirer.prompt([
            {
                type: "input",
                name: "selection",
                message: "Please enter the ID of the product you would like stock",
                validate: function (value) {
                    if (isNaN(value) === false)
                        return true;
                }
            }, {
                type: "input",
                name: "quantity",
                message: "Enter the quantity you would like to stock",
                default: 1,
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                }
            }
        ]).then(function(answer){
            var selectedItem;
            for (var i = 0; i < results.length; i++){
                if (results[i].item_id === parseInt(answer.selection)){
                    selectedItem = results[i];

                }
            }
            //Checks to see if we have order quantity in stock

            var newStock = parseInt(selectedItem.stock_quantity) + parseInt(answer.quantity);
            if (newStock >= 0){
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newStock
                }, {
                    item_id: selectedItem.item_id
                }
                ]);

            }

            managerSelections();
        })
    });

};

var newProduct = function(){
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What Item Would you Like to Add To Inventory?",
            validate: function(value){
                if (value !== null) {
                    return true;
                } else {
                    console.log('You cannot add an item without entering the product name');
                    return false;
                }
            }
        }, {

            type: "input",
            name: "department",
            message: "What department should this item be placed?",
            validate: function(value){
                if (value !== null) {
                    return true;
                } else {
                    console.log('You cannot add an item without specifying the department');
                    return false;
                }
            }
        }, {
            type: "input",
            name: "price",
            message: "What is the suggested retail price?",
            validate: function(value){
                if (isNaN(value) === false){
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            type: "input",
            name: "quantity",
            message: "What quantity will you be adding to our inventory?",
            validate: function(value){
                if (isNaN(value) === false){
                    return true;
                } else {
                    return false;
                }
            }

        }

]).then(function(answer){
    connection.query("INSERT INTO products SET ?", {
        product_name: answer.name,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.quantity
    }, function(err, results) {
        if(err) throw err;
    });
        managerSelections();
})

};