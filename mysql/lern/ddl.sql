create database cofee_store;
show databases;
use cofee_store;
show tables
DESCRIBE customers;
CREATE TABLE orders (
    SNO INT AUTO_INCREMENT PRIMARY KEY,
    productID int,
    customerID int,
    date datetime,
    foreign key (productID) references product(SNO), 
CREATE TABLE orders (
    SNO INT AUTO_INCREMENT PRIMARY KEY,
    productID INT,
    customerID INT,
    date DATETIME,
    FOREIGN KEY (productID) REFERENCES products(SNO), 
    FOREIGN KEY (customerID) REFERENCES customers(SNO)
);
describe  products;
alter table products
drop column number;
drop table customers
