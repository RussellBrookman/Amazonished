var mysql = require("mysql"); 
/*var nodeArgs = process.argv;*/
var inquirer = require('inquirer');

var connection = mysql.createConnection({   
	host: "localhost",   
	port: 3306,   
//  username   
	user: "root",   
//  password   
	password: "",   
	database: "bamazon_db" 
}); 

connection.connect(function(err) {   
	if (err) throw err;   
	console.log("connected as id " + connection.threadId + "\n");   
	readProducts();
});   

function readProducts() {   
	console.log("Here is everything in strore.\n");   
	connection.query("SELECT * FROM products", function(err, res) {     
		if (err) throw err;     
// Log results from SELECT    
		console.log(res);	
		runningSearch();        
	}); 
}  

function runningSearch() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "Are you interested in any of these items? y or n",
		choices: ["y", "n"]
	}).then(function(answer) {
		switch(answer.action) {
			case "y":
			productSearch();
			break;

			case "n":
			console.log("Have a nice day!")
			connection.end();
		}
	})
}

function productSearch() {
	inquirer.prompt({
		name: "item_id",
		type: "input",
		message: "What item can I help you with today? choose item number"
	}).then(function(answer) {
		var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM index.sql WHERE ?";
		connection.query(query, { item_id: answer.item_id }, function(err, res) {
			for(var i = 0; i < res.length; i++) {
				console.log("item_id: " + res[i].item_id + " || Name: " + res[i].product_name + " || department: " + res[i].department_name + " || price: " + res[i].price + " || left in stock: " + res[i].stock_quantity);
			}		
			purchaseFinal();
		})
	})
}

function purchaseFinal() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "Would you like to purchase this item? y or n",
		choices: ["y", "n"]
	}).then(function(answer) {
		switch(answer.action) {
			case "y":
			updateProduct();
			break;

			case "n":
			readProducts();
			break;
		}
	})
}

function updateProduct() {
	connection.query("SELECT price FROM products", function(err, res) {    
		if (err) throw err; 
		if (product.price == 0) {
// start here
		}


// Log results from SELECT    
		console.log(res);	
		runningSearch(); 


	var notIn === 0;
	var inSto !== 0;
	SELECT item_id,
		case products.stock_quantity
			when inSto then
	console.log("We have removed one of these items from our inventory.\n");   
	var query = connection.query( "UPDATE products SET ? WHERE ?",     
	[       
	{ stock_quantity: -1 },            
	],       
	addToTotal();
		when notIn then 
			console.log("Insufficient quantity! Chose another item.");
			readProducts();
	FROM products.stock_quantity
	// logs the actual query being run   
/*	console.log(query.sql); */
	);
}
function addToTotal() {
	SELECT item_id, 
		case products.price
	FROM products.price
	SELECT cash
		case cash.total  
	FROM cash.price
	console.log("Thank you for your purchase. Your total has been updated.");
	var query = connection.query( "UPDATE products SET ? WHERE ?",
	[
	{	cash.total: +products.price	}
	]
		)
}
// dont forget this once you figure out where to put it
//		connection.end();