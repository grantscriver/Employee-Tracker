DROP DATABASE IF EXISTS employeetracker;

CREATE DATABASE employeetracker;

USE employeetracker;

create table employee (
	id int not null auto_increment,
    first_name varchar(30) null,
    last_name varchar(30) null,
    role_id int null,
    manager_id int null,
    primary key (id)
);

create table department (
	id int not null auto_increment,
    name varchar(30) null,
    primary key (id)
);

create table role (
	id int not null auto_increment,
    title varchar(30) null,
    salary decimal null,
    department_id int null,
    primary key (id)
);

drop table role;
drop table employee;
drop table department;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dwight", "Schrute", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Pam", "Beesly", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Halpert", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("barney", "rubble", 7, 1);


INSERT INTO role (title, salary, department_id)
VALUES ("Office Manager", 94000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Salesman", 60000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Admin", 40000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Janitor", 30000, 2);


INSERT INTO department (name)
VALUES ("Executive");

INSERT INTO department (name)
VALUES ("Production");
 use employeetracker;

select *
from role;

INSERT INTO department (name) VALUES ("500f");

select employee.manager_id, CONCAT(employee.first_name,  " ", employee.last_name) as employee_name, role.title, role.salary from employee INNER JOIN role on employee.id = role.id;

select * from employee INNER JOIN role on employee.role_id = role.id;

select temp.employee_name, temp.department, temp.title, temp.salary, CONCAT(employee.first_name,  " ", employee.last_name) as manager_name from temp LEFT JOIN employee on employee.id = temp.manager_id;


select CONCAT(first_name, " ", last_name) as employee_name FROM employee;

SELECT * from employee;
