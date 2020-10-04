const inquirer = require("inquirer");
// const Choice = require("inquirer/lib/objects/choice");

var mysql = require("mysql");
const { user, password } = require("./config");
// const { type } = require("os");
// const { allowedNodeEnvironmentFlags } = require("process");

// I successfully made this connection below... how do we make it so that when we push to github the user can connect?

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  // port: 3306,

  // Your username
  user: user,

  // Your password
  password: password,
  database: "employeetracker",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  mainMenu();
});

let employeeArray = [];
let rolesArray = [];
let employeeNumForRoleChange;
let roleNumForRoleChange;

function mainMenu() {
  let roleTitle;
  let roleSalary;
  let firstName;
  let lastName;
  let roleId;
  inquirer
    .prompt([
      {
        name: "mainPrompt",
        type: "list",
        message: "Main Menu",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Departments",
          "View Roles",
          "View Employees",
          "Update Employee Role",
        ],
      },
    ])
    .then((answer) => {
      if (answer.mainPrompt == "Add Department") {
        addDepartment();
      } else if (answer.mainPrompt == "Add Role") {
        addRole();
      } else if (answer.mainPrompt == "Add Employee") {
        addEmployee();
      } else if (answer.mainPrompt == "View Departments") {
        viewDepartments();
      } else if (answer.mainPrompt == "View Roles") {
        viewRoles();
      } else if (answer.mainPrompt == "View Employees") {
        viewEmployees();
      } else if (answer.mainPrompt == "Update Employee Role") {
        updateEmployeeRole();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What department do you want to add?",
      },
    ])
    .then((answer) => {
      console.log(answer.department);
      connection.query(
        `INSERT INTO department (name) VALUES ("${answer.department}")`,
        function (err, res) {
          if (err) throw err;
        }
      );
      mainMenu();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "What Role do you want to add?",
      },
    ])
    .then((answer) => {
      roleTitle = answer.role;
      getSalary();
    });
}

function getSalary() {
  inquirer
    .prompt([
      {
        name: "salary",
        type: "input",
        message: "What is the annual salary for this role?",
      },
    ])
    .then((answer) => {
      roleSalary = answer.salary;
      getDepartmentId();
    });
}

function getDepartmentId() {
  inquirer
    .prompt([
      {
        name: "departmentId",
        type: "input",
        message: "What is the department ID (number) for this role?",
      },
    ])
    .then((answer) => {
      connection.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${roleTitle}","${roleSalary}","${answer.departmentId}")`,
        function (err, res) {
          if (err) throw err;
        }
      );
      mainMenu();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
    ])
    .then((answer) => {
      firstName = answer.firstName;
      getLastName();
    });
}

function getLastName() {
  inquirer
    .prompt([
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
    ])
    .then((answer) => {
      lastName = answer.lastName;
      getRoleId();
    });
}

function getRoleId() {
  inquirer
    .prompt([
      {
        name: "roleId",
        type: "input",
        message: "What is the employee's role id? (number)",
      },
    ])
    .then((answer) => {
      roleId = answer.roleId;
      getManagerId();
    });
}

function getManagerId() {
  inquirer
    .prompt([
      {
        name: "managerId",
        type: "input",
        message: "What is the employee id (number) of this employee's manager?",
      },
    ])
    .then((answer) => {
      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}","${lastName}","${roleId}", "${answer.managerId}")`,
        function (err, res) {
          if (err) throw err;
        }
      );
      mainMenu();
    });
}

function viewDepartments() {
  console.log("Displaying departments...\n");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    console.table(res);
    mainMenu();
  });
  // logs the actual query being run
}

function viewRoles() {
  console.log("Displaying roles...\n");
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    console.table(res);
    mainMenu();
  });
  // logs the actual query being run
}

function viewEmployees() {
  console.log("Displaying employees...\n");

  connection.query(
    'select CONCAT(employee.first_name,  " ", employee.last_name) as employee_name, role.title, role.salary from employee INNER JOIN role on employee.role_id = role.id',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    }
  );

  // logs the actual query being run
}

function updateEmployeeRole() {
  //
  // Get an array containing all employees.  this requires mySQL and a for loop
  //
  connection.query(
    'select CONCAT(first_name, " ", last_name) as employee_name FROM employee',
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        employeeArray.push(res[i].employee_name);
      }
    }
  );
  //
  // Get an array containing all roles.  this requires mySQL and a for loop
  //
  connection.query("select title from role", function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
    chooseEmployeeForRoleUpdate();
  });
}

//
// use inquirer with list to ask user which employee they want to update the role of
//

function chooseEmployeeForRoleUpdate() {
  inquirer
    .prompt([
      {
        name: "employeeChoice",
        type: "list",
        message: "Choose employee to update their role",
        choices: employeeArray,
      },
    ])
    .then((answer) => {
      for (var i = 0; i < employeeArray.length; i++) {
        if (answer.employeeChoice == employeeArray[i]) {
          employeeNumForRoleChange = i;
        }
      }
      chooseRoleForRoleUpdate();
    });
}

//
// use inquirer with list to ask user which role they want the employee chosen above to have.  We need the id from the role table for the chose role
//
function chooseRoleForRoleUpdate() {
  inquirer
    .prompt([
      {
        name: "roleChoice",
        type: "list",
        message: "Choose new role for chosen employee",
        choices: rolesArray,
      },
    ])
    .then((answer) => {
      for (var i = 0; i < rolesArray.length; i++) {
        if (answer.roleChoice == rolesArray[i]) {
          roleNumForRoleChange = i;
        }
      }
      //  replaceRoleForEmployee();
    });
}
//
// execute mySQL to replace the employee's role in the employee database by changing the employees role_id
//

//
// call mainMenu function when complete
//
