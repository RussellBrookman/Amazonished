DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE	bamazonDB;

USE bamazonDB;
		
-- creating the table--
CREATE TABLE products (
	item_id INTEGER(2) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(25) NOT NULL,
	department_name VARCHAR(15) NOT NULL,
	price INTEGER(6),
	stock_quantity INTEGER(6),
	PRIMARY KEY(item_id)
);

CREATE TABLE cash (
	totalPurchase INTEGER(7) AUTO_INCREMENT NOT NULL,
)

-- creating new rows containing data--
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (01, "Terminator 2, Pinball", "Pinball", 4000, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (02, "Star Wars, Pinball", "Pinball", 5600, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (03, "Sonic Spinball, Sega", "Video Game", 7, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (04, "Lunar, PlayStation", "Video Game", 60, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (05, "Zelda, NES", "Video Game", 8, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (06, "ET, Atari", "Video Game", 6, 10000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (07, "Flat Screen TV", "Electronics", 250, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (08, "Apple Computer", "Electronics", 1300, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (09, "Dell Computer", "Electronics", 430, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES (10, "Comp Backup Drive", "Electronics", 60, 20);

INSERT INTO cash (totalPurchase)
VALUES (0);