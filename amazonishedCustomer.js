var mysql = require("mysql"); 
// var nodeArgs = process.argv;
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({   
	host: "localhost",
	port: 3306,
	user: "root",
	password: "iwantmysql81",
	database: "amazonishedDB"
}); 

let purchasedItems = [];
let totalPurchase = [];


let readProducts = function () {
	connection.connect(function(err) {    
		if (err) throw err;   
		console.log("connected as id " + connection.threadId + "\n");   
		connection.query(`SELECT * FROM products`, function(err, res) {   
			if (err) throw err; 
      	let cliTable = new Table({
        	head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'QUANTITY_IN_STOCK'],
        	colWidths: [5, 25, 15, 10, 20]
      	});
      	for (let i = 0; i < res.length; i++) {
      		// console.log("Item_id: " + res[i].item_id + " || Product_name: " + res[i].product_name + " || Department_name: " + res[i].department_name + " || Price: " + res[i].price + " || Stock_Quantity" + res[i].stock_quantity + "\n");	
       		cliTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
     		}
      	console.log("Here is everything in the strore.\n");
      	console.log(cliTable.toString());
     		inquirer.prompt({
					name: "action",
					type: "rawlist",
					message: "Are you interested in any of these items?",
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
			let productSearch = function(val, ans) {
				inquirer.prompt([
				{
					name: 'id',
					type: 'input',
					message: "What item can I help you with today? (choose item number)",
					validate: (val) => !isNaN(parseInt(val))
				}, {
		         	name: 'quan',
		         	type: 'input',
			        message: "How many would you like?",
			        validate: (val) => !isNaN(parseInt(val))
				}
				]).then(function (ans) {
	        purchaseItem(ans.id, ans.quan);
        });
			};
			//dealing with a nested function
			readProducts.productSearch = productSearch;
		});
	});
};

let purchaseItem = function(id, quan) {
	connection.query(
		`SELECT product_name, stock_quantity, price FROM products WHERE item_id=${ id }`,
		function (err, res) {
	    if (err) throw err;
	    // res is the callback passed from id or quan.
	   	if (parseInt(quan) > res[0].stock_quantity) {
	      inquirer.prompt({
					name: "action",
					type: "rawlist",
					message: "Sorry, we don't have enough of this item to fill your order. Would you like to purchase another item or purchase this item in a lesser amount (y or n)",
					choices: ["y", "n"]
				}).then(function(answer) {
					switch(answer.action) {
						case "y":
						readProducts.productSearch();
						break;
					
						case "n":
						console.log("Thank you for stopping by and we hope you have a nice day.")
						break;
					}
				})
	     	} else {
	     		purchasedItems.push(res[0].product_name);
		      let inventory = res[0].stock_quantity - parseInt(quan);
		      let purchasePrice = res[0].price * parseInt(quan);
		      let totPur = 0;
		     	// totalPurchase.splice([0]);
		      totalPurchase.push(purchasePrice);
		      for (var i = 0; i < totalPurchase.length; i++) {
		     			totPur += parseInt(totalPurchase[i]);
		     	};
		      connection.query(
		   			`UPDATE products SET stock_quantity=${ inventory }, product_sales = product_sales + ${ purchasePrice } WHERE item_id = ${ id }`,
		       	function (err, res) {
	            if (err) throw err;
		          // console.log(`Your Total: $${ purchasePrice.toFixed(2) }`, 'Thank you for your purchase.');
		          console.log('Your Total: ' + totPur + '.00\n' + 'Thank you for your purchase.');
		         	checkout();
		       	}
		      );
	     	}
	  }
	);
};

function checkout() {
	var query = `Select totalPurchase FROM cash`;
	connection.query(query, function(err, res) {
		console.log("You have purchased a " + purchasedItems[0] + ". Total: $" + totalPurchase[0] + ".00\n");
		inquirer.prompt({
			name: "action",
			type: "list",
			message: "Would you like to purchase anything else? (y or n)",
			choices: ["y", "n"]
		}).then(function(answer) {
			switch (answer.action) {
				case "y":
				console.log("What else can I help you with?\n");
				try {
					readProducts.productSearch();
				}
				catch (error) {
					console.error(error);
				}
				break;

				case "n":
				console.log("Thank you for your purchase. Have a wonderful day.\n")
				connection.end();
				break;
			}	
		});
	});
};

readProducts();