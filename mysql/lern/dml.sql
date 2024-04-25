create database testing

use testing;
create table adress(
 id int,
 house_number int,
 address varchar(30),
 postal_code char(7)
);
create table people(
 id int,
 first_name varchar(20),
 last_name varchar(20),
 adress varchar(30)
)
show tables

create table pets(
 id int,
 pet_name varchar(20),
 species varchar(10),
 owner_id int
)
 describe pets
  
  alter table people
  modify id int 
  
   alter table pets
   add constraint fk_pets
   foreign key (owner_id)
   references people(id)
   
    alter table pets
    -- drop foreign key fk_pets
    drop index fk_pets
    
    alter table pets
    drop index u_species
    
    describe pets
   
   
   alter TABLE people 
   add constraint U_email unique (email)
   describe people
	change adress address varchar(30)
    
    alter table pets
    add constraint fk_pets foreign key (owner_id) references people(id)
    
    describe pets
    alter table pets
    change pet_name first_name varchar(20)
    
    describe adress
    alter table adress
    modify pin_code char(7)
describe pets
    alter table pets
    add constraint fk_pets foreign key(owner_id)  references people(id)
    alter table people
    modify id int  auto_increment
    describe people
    select * from people
    insert into people(first_name,last_name,address,email)
    values ("dinesh","sri","kjs jf","mde@gmail.com"),("dinesh","sri","kjs jf","mdeee@gmail.com")
    update people
    set first_name='srihari'
    where id=1;
    
    delete from people
    where id=2
    create table items(
    id int primary key auto_increment,
    item_name varchar(30),
    price decimal(10,2)
    )
    describe items
    insert into items(item_name,price)
    values ("biryani",120.99),("iphone",699.99)
    delete from items
    where id=4
    select * from items
    