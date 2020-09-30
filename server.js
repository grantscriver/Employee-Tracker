const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");

var mysql = require("mysql");
const { type } = require("os");

// I successfully made this connection below... how do we make it so that when we push to github the user can connect?

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "theman",

  // Your password
  password: "password",
  database: "employeetracker",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  mainMenu();
});

function mainMenu() {
  inquirer.prompt([
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
  ]);
}

// This query is working, but the output is objects.  Please help me display the query results
function displayEmployees() {
  console.log("Displaying employees...\n");
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    console.table(res);
    addDepartment();
  });
  // logs the actual query being run
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
    });
}
