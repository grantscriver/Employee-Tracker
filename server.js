const inquirer = require("inquirer");

var mysql = require("mysql");

// We successfully made this connection below... how do we make it so that when we push to github the user can connect?

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
  displayEmployees();
});

// This query is working, but the output is objects.  Please help me display the query results
function displayEmployees() {
  console.log("Displaying employees...\n");
  var query = connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    //
    // this works, but just gives first name of first row
    //console.log(res[0].first_name+ " employees displayed!\n");
    //
    // this gives undefined
    //console.log(res.affectedRows + " employees displayed!\n");
    //
    //this gives objects as results
    console.log(res + " employees displayed!\n");
  });

  // logs the actual query being run
  console.log(query.sql);
}
