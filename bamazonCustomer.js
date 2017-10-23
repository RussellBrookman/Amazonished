var mysql = require("mysql"); 
/*var nodeArgs = process.argv;*/
var inquirer = require('inquirer');
var index = require('./index.sql');
var packageJSON = require('./package.json');

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
			console.log("Have a nice day!\n")
			connection.end();
		}
	})
}
//	this is an example of an if else statement which could also work
//    .then(function(answer) {       // based on their answer, either call the bid or the post functions       if (answer.postOrBid.toUpperCase() === "POST") {         postAuction();       }       else {         bidAuction();       }     }); }
var purchasedItem;

function productSearch() {
	connection.query("SELECT * FROM products", function(err, res) {
	inquirer.prompt({
		name: "item_id",
		type: "input",
		message: "What item can I help you with today? choose item number",
		choices: 
		function() {
			var choiceArray = [];
			for (var i = 0; i < res.length; i++) {
				choiceArray.push(res[i].item_id);
			}
			return choiceArray;
		}
	}).then(function(answer) {
			for (var i = 0; i < res.length; i++) {
				if (res[i].item_id === answer.item_id) {
					purchasedItem = res[i];
					console.log("item_id: " + res[i].item_id + " || Name: " + res[i].product_name + " || department: " + res[i].department_name + " || price: " + res[i].price + " || left in stock: " + res[i].stock_quantity + "\n");
					purchaseFinal();
				}
			}
		});
	});
};
	
function purchaseFinal() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
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
	})
};

function updateProduct() {
	/*connection.query("SELECT" + purchasedItem + "FROM products", function(err, res) {*/
	if (product.stock_quantity > 0) {	
		connection.query(
			"UPDATE products SET ? WHERE ?"
			[
				{ stock_quantity: -1 },
				{ item_id: "products.item_id" }
			],
			function(err, res) {
				if (err) throw err;
				console.log("We have removed a " + res.product_name + "from our inventory and will be shipping it to you shortly.\n" );
				addToTotal();
			}
		);
	} else {
		console.log("Insufficient quantity! Chose another item.\n");
		readProducts();
	}
};
	/*});*/
		
var greenDolarSpentPlaya; 

function addToTotal() {	
	connection.query("SELECT * FROM cash", function(err, res) {
		connection.query(
			"UPDATE products SET ? WHERE ?"
			[
				{ totalPurchase: + purchasedItem.price },
				{ totalPurchase: "totalPurchase" }
			],
			function(err, res) {
				if (err) throw err;
				checkout();
			}
		);
	});
} 		

function checkout() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "You have purchased a " + purchasedItem.product_name + " . " + "Your total is " + greenDolarSpentPlaya.totalPurchase + " . " + "Would you like to purchase something else?",
		choices: ["y", "n"]
	}).then(function(answer) {
		switch(answer.action) {
			case "y":
			console.log("What else can I help you with?\n");
			readProducts();
			break;
			case "n":
			console.log("Thank you for your purchase. Have a wonderful day.\n");
			connection.end();
			break;
		}
	});
};
