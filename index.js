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
                viewDepartments();
                break;
            case "View role":
                viewRoles();
                break;
            case "View employee":
                viewEmployees();
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
        message: "Input the name of the department you would like to add: "
    }).then(function({ departmentName }) {
        var queryStr = "INSERT INTO departments (name) VALUES (?)";
        connection.query(queryStr, departmentName, function(err, res) {
            if (err) throw err;
            init();
        });
    });
}

function addRole() {
    connection.query("SELECT id, name FROM departments", function(err, res) {
        const departmentChoices = res.map(
            ({ id, name }) => 
            ({ value: id, name: name })
        );
        console.log(departmentChoices);
        
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Input the title of the role you would like to add: "
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Input the salary for this role: "
            },
            {
                name: "departmentUnder",
                type: "list",
                message: "What department will this role be listed under?",
                choices: departmentChoices
            }
        ]).then(function(role) {
            console.log(role);
            var queryStr = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(queryStr, [role.roleTitle, role.roleSalary, role.departmentUnder], function(err, res) {
                if (err) throw err;
                init();
            });
        });
    });
}

function addEmployee() {
    init();
}

function viewDepartments() {
	init();
}

function viewRoles() {
	init();
}

function viewEmployees() {
	init();
}

function updateEmployeeRole() {
	init();
}