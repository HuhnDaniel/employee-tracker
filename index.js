var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "company_db"
});

connection.connect(function (err) {
	if (err) throw err;
	init();
});


function init() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add department",
            "Add role",
            "Add employee",
            "View department",
            "View role",
            "View employee",
            "Update employee role",
            "Exit program"
        ]
    }).then(function({ action }) {
        switch (action) {
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "View department":
                viewDepartment();
                break;
            case "View role":
                viewRole();
                break;
            case "View employee":
                viewEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Exit program":
                connection.end();
                break;
        }
    });
}

function addDepartment() {
    inquirer.prompt({
        name: "departmentName",
        type: "input",
        message: "Input the department you would like to add: "
    }).then(function({ departmentName }) {
        var queryStr = "INSERT INTO department (name) VALUES (?)";
        connection.query(queryStr, departmentName);
        init();
    })
}

function addRole() {
	init();
}

function addEmployee() {
	init();
}

function viewDepartment() {
	init();
}

function viewRole() {
	init();
}

function viewEmployee() {
	init();
}

function updateEmployeeRole() {
	init();
}