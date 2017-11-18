var mysql = require("mysql"); 
/*var nodeArgs = process.argv;*/
var inquirer = require('inquirer');

var connection = mysql.createConnection({   
	host: "localhost",   
	port: 3306,   
//  username   
	user: "root",   
//  password   
	password: "IwantMySQL",   
	database: "bamazon_db" 
}); 

var purchasedItem = [];

connection.connect(function(err) {   
	if (err) throw err;   
	console.log("connected as id " + connection.threadId + "\n");   
	readProducts();
});   

function readProducts() {   
	var query = "SELECT * FROM products";  
	connection.query(query, function(err, res) {     
		for (var i = 0; i < res.length; i++) {		
			console.log("Item_id: " + res[i].item_id + " || Product_name: " + res[i].product_name + " || Department_name: " + res[i].department_name + " || Price: " + res[i].price + " || Stock_quantity" + res[i].stock_quantity + "\n");	
		}
		console.log("Here is everything in strore.\n");
		runningSearch();        
	}); 
}  

function runningSearch() {
	inquirer.prompt({
		name: "action",
		type: "rawlist",
		message: "Are you interested in any of these items? (y or n)",
		choices: ["y", "n"]
	}).then(function(answer) {
		switch(answer.action) {
			case "y":
			productSearch();
			break;

			case "n":
			console.log("Have a nice day!\n");
			connection.end();
			break;
		}
	})
}

function productSearch() {
	inquirer.prompt({
		name: "item_id",
		type: "input",
		message: "What item can I help you with today? (choose item number)",
	}).then(function(selectedItem) {
		var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE ?";
		connection.query(query, { item_id: selectedItem.item_id }, function(err, res) {
			for (var i = 0; i < res.length; i++) {
				if (res[i].item_id === selectedItem.item_id) {
					console.log("Item_id: " + res[i].item_id + " || Product_name: " + res[i].product_name + " || Department_name: " + res[i].department_name + " || Price: " + res[i].price + " || Stock_quantity" + res[i].stock_quantity + "\n");
					purchasedItem.push(selectedItem);
					purchaseFinal();	
				} else {
					console.log("We don't have a record for Item_id number: " + item_id + ". Please choose a selected Item.");
					productSearch();
				}
			}
		});
	});
};

function purchaseFinal() {
	inquirer.prompt({
		name: "action",
		type: "rawlist",
		message: "Would you like to purchase this item? (y or n)",
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
}

function updateProduct() {
	if (product.stock_quantity > 0) {	
		var query = connection.query("UPDATE products SET ? WHERE ?",
			[
				{ stock_quantity: -1 },
				{ item_id: purchasedItem[0] }
			],
			function(err, res) {
				console.log("We have removed a " + res.affectedRows + " from our inventory and will be shipping it to you shortly.\n" );
				addToTotal();
			}
		);
	} else {
		console.log("Insufficient quantity! Chose another item.\n");
		readProducts();
	}
};

function addToTotal() {	
	var query = connection.query("UPDATE cash SET? WHERE ?",
		[
			{ totalPurchase: purchasedItem[3] }
			{ item_id: purchasedItem[0] }
		]
	)
	checkout();
} 		

function checkout() {
	var query = "Select totalPurchase FROM cash";
	connection.query(query, function(err, res) {
		console.log("You have purchased a " + purchasedItem[1] + ". " " Total: $" + res[0] + ".00\n");
	});
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "Would you like to purchase anything else? (y or n)",
		choices: ["y", "n"]
	}).then(function(answer) {
		switch (answer.action) {
			case "y":
			console.log("What else can I help you with?\n");
			readProducts();
			break;
			case "n":
			console.log("Thank you for your purchase. Have a wonderful day.\n")
			connection.end();
			break;
		}	
	});
};