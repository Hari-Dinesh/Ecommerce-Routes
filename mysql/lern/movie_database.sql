create database movie_booking
SHOW databases
use movie_booking
-- --movie table
create table films(
	id int primary key auto_increment,
    name varchar(30) not null unique,
    length_in_min decimal(3,2) not null
);
-- customers table
create table customers(
id int primary key auto_increment,
first_name varchar(30),
last_name varchar(30) not null,
email varchar(60) not null unique
);
create table rooms(
id int primary key auto_increment,
room_name varchar(20) not null,
capacity int not null
);
show tables

