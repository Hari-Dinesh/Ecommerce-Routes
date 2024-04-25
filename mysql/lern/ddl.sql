create database cofee_store;--create a database
show databases;
use cofee_store;
show tables
DESCRIBE customers;
CREATE TABLE orders (
    SNO INT AUTO_INCREMENT PRIMARY KEY,
    productID int,
    customerID int,
    date datetime,
    foreign key (productID) references product(SNO)
)
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
use bloodbank
drop table bloodinfo
drop database bloodbank

create table customers(
id INT AUTO_INCREMENT PRIMARY KEY not null,
name varchar(25) ,
phone varchar(11),
password char(60) NOT null,
email VARCHAR(255) NOT NULL,
gender enum('Male','female'),
verified boolean default false
);
show tables
drop table customers
describe customers;

use bloodbank
show tables
select * from bloodbank.hospitals