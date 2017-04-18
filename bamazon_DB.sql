CREATE DATABASE bamazon;

  USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock)
      VALUE("JavaScript for Dummies ","Books", 10, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("PHP for Dummies ","Books", 25, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("CSS for Dummies ","Books", 15, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("HTML for Dummies ","Books", 10, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("Avatar ","Movies", 20, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("The Force Awakens ","Movies", 20, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("The Matrix ","Movies", 10, 500);

INSERT INTO products (product_name, department_name, price, stock)
  VALUE("Goonies ","Movies", 10, 500);

select * from products;