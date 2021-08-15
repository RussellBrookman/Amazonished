DROP DATABASE IF EXISTS amazonishedDB;

CREATE DATABASE	amazonishedDB;

USE amazonishedDB;

-- creating the table--
CREATE TABLE products (
	item_id INT(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255) NOT NULL,
	price FLOAT(10, 2) NOT NULL,
	stock_quantity INT(10) NOT NULL,
	product_sales FLOAT(10, 2) NOT NULL DEFAULT 0.00,
	PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INT(10) NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(65) NOT NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE cash(
  totalPurchase INT(255) NOT NULL
);

-- creating new rows containing data--
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Terminator 2, Pinball", "Pinball", 4000, 1, 0.00),
("Star Wars, Pinball", "Pinball", 5600, 5, 0.00),
("Sonic Spinball, Sega", "Video Game", 7, 25, 0.00),
("Lunar, PlayStation", "Video Game", 60, 10, 0.00),
("Zelda, NES", "Video Game", 8, 3, 0.00),
("ET, Atari", "Video Game", 6, 10000, 0.00),
("Flat Screen TV", "Electronics", 250, 10, 0.00),
("Apple Computer", "Electronics", 1300, 20, 0.00),
("Dell Computer", "Electronics", 430, 5, 0.00),
("Comp Backup Drive", "Electronics", 60, 20, 0.00);

INSERT INTO cash (totalPurchase)
VALUES (0.0);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Pinball", 1000),
("Video Game", 5),
("Electronics", 100);
