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

let enterSite = function() {
	connection.connect(function(err) {    
		if (err) throw err;   
		console.log("connected as Manager"); 
	managerChoices(); 
	});
};

let managerChoices = function() { 
	inquirer.prompt({
		name: "action",
		type: "rawlist",
		message: "What would you like to do?",
		choices: ["See Products for Sale", "See Low Inventory", "Add to Inventory", "Add new Product", "Leave Store"]
	}).then(function(answer) {
		// note: the case must be spelled exactly the same as the choices including caps. In a published application I should add toUpper or toLowerCase to fix this.
		switch(answer.action) {
			case "See Products for Sale":
			listAll();
			break;

			case "See Low Inventory":
			lowInventory();
			break;			

			case "Add to Inventory":
			addInventory();
			break;

			case "Add new Product":
			newProduct();
			break;

			case "Leave Store":
			console.log("Have a nice day!");
			connection.end();
			break;
		}
	});
};

let continueChoice = function() {
  inquirer.prompt({
		name: "action",
		type: "rawlist",
		message: "Would you like to do anything else?",
		choices: ["y", "n"]
	}).then(function(answer) {
	 	switch(answer.action) {
	 		case "y":
	  	managerChoices();
	  	break;
	
	 		case "n":
	  	console.log("Have a wonderful day!!");
	  	connection.end();
	  	break;
		}
	})
}

let listAll = function() { 
	connection.query(`SELECT * FROM products`, function(err, res) {   
		if (err) throw err; 
		const cliTable = new Table({
  		head: ['ID', 'PRODUCT', 'DEPARTMENT', 'PRICE', 'QUANTITY_IN_STOCK'],
  		colWidths: [5, 25, 15, 10, 20]
		});
    for (let i = 0; i < res.length; i++) {
      cliTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.log("Here is everything in your strore.\n");
   	console.log(cliTable.toString());
  	continueChoice();
	});
};

let lowInventory = function() {
	connection.query(`SELECT * FROM products`, function(err, res) {
		if (err) throw (err);
		for (let i = 0; i < res.length; i++) {
		  if (res[i].stock_quantity <= 5) {
		  	tempTable = [];
		  	tempTable.push([res[i].item_id]);
		  	console.log("id#: " + [res[i].item_id, " name: " + res[i].product_name, " department: " + res[i].department_name, " price: $" + res[i].price, " in stock: " + res[i].stock_quantity]);
		  } 
		};
		if (tempTable = !isNaN(parseInt(tempTable))) {
			tempTable = [];
			managerChoices();
		}
	})
};

let addInventory = function(val, ans) {
	connection.query(`SELECT * FROM products`,
	function(err, res) {
		inquirer.prompt([
		{
			name: 'id',
			type: 'input',
			message: "Which item would you like to add more of to the shelf?",
			validate: (val) => !isNaN(parseInt(val))
		}, {
			name: 'quan', 
			type: 'input',
			message: "How many would you like to add?",
			validate: (val) => !isNaN(parseInt(val))
		}
		]).then(function (ans) {
			// time saver: because I can't pass an async function, this must be passed to a callback
			// and called in a seprate function. IE:(val, ans)
			addInventoryContinued(ans.id, ans.quan);
		});
	});
};

let addInventoryContinued = function(id, quan) {
	connection.query(
	`SELECT product_name, stock_quantity, price FROM products WHERE item_id=${ id }`, 
	function(err, res) {
		if (err) throw (err);
		let oldInventory = res[0].stock_quantity;
		let newInventory = res[0].stock_quantity + parseInt(quan);
		let item = res[0].product_name;
		connection.query(
			`UPDATE products SET stock_quantity=${ newInventory } WHERE item_id=${ id }`,
		function(err, res) {
			if (err) throw (err);
			console.log("\n You had " + oldInventory + " of " + item + "s in stock.\n You have added " + parseInt(quan) + 
				" to your inventory.\n You now have " + newInventory + " " + item + "s in stock.\n");
			managerChoices();
		});
	});
}

let newProdAdded = [];

let newProduct = function(val, ans) {
	let depTemp = [];
	connection.query(`SELECT * FROM departments`,
	function(err, res) {
		if (err) throw (err);
		for (let i = 0; i < res.length; i++) {
			depTemp.push([res[i].department_name]);
		};
		inquirer.prompt([
		  {
				name: 'prodName',
				type: 'input',
				message: "What is the name of the item you would like to add to the list?",
				validate: (val) => isNaN(toString(val))
			}, {
				name: 'depart',
				type: 'rawlist',
				message: "Which department would you like to add this to?",
				choices: [`${ depTemp[0] }`, `${ depTemp[1] }`, `${ depTemp[2] }`],
				validate: (val) => !isNaN(parseInt(val))
			}, {
				name: 'yourPrice',
				type: 'input',
				message: 'How much will you be charging for this item?',
				validate: (val) => !isNaN(parseInt(val))
			}, {
				name: 'inStock',
				type: 'input',
				message: 'How many do you currently have in stock?',
				validate: (val) => !isNaN(parseInt(val))
			}
			]).then(function (ans) {
				newProdAdded.push(ans.prodName, ans.depart, ans.yourPrice, ans.inStock);
				addingANewProduct();
			});
	});
};

let addingANewProduct = function() {
 	connection.query(`INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales) 
 		VALUES ("${ newProdAdded[0] }", "${ newProdAdded[1] }", "${ newProdAdded[2] }", "${ newProdAdded[3] }", 0.00);`,
 	function(err, res) {
	  if (err) throw (err); 
	  newProdAdded = [];
    managerChoices();
  });
};

enterSite();
