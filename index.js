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
            "View departments",
            "View roles",
            "View employees",
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
            case "View departments":
                viewDepartments();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View employees":
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
            console.log(`Added new department ${departmentName}.`);
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
        ]).then(function({ roleTitle, roleSalary, departmentUnder }) {
            var queryStr = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(queryStr, [roleTitle, roleSalary, departmentUnder], function(err, res) {
                console.log(`Added new role ${roleTitle} with salary ${roleSalary}.`);
                init();
            });
        });
    });
}

function addEmployee() {
    connection.query("SELECT id, first_name, last_name FROM employees", function(err, res) {
        const managerChoices = res.map(
            ({ id, first_name, last_name }) =>
            ({ value: id, name: first_name + " " + last_name })
        );
        managerChoices.unshift({ value: null, name: "None" });

        connection.query("SELECT id, title FROM roles", function(err, res) {
            const roleChoices = res.map(
                ({ id, title }) =>
                ({ value: id, name: title})
            );

            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "Input new employee's first name: "
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Input new employee's last name: "
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "What role will the new employee fill?",
                    choices: roleChoices
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Who will be the manager of the new employee?",
                    choices: managerChoices
                }
            ]).then(function({ firstName, lastName, employeeRole, employeeManager }) {
                var queryStr = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                connection.query(queryStr, [firstName, lastName, employeeRole, employeeManager], function(err, res) {
                    console.log(`Added new employee ${firstName} ${lastName}.`);
                    init();
                });
            });
        });
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM departments", function(err, res) {
        console.table(res);
        init();
    });
}

function viewRoles() {
    connection.query("SELECT * FROM roles", function(err, res) {
        console.table(res);
        init();
    });
}

function viewEmployees() {
    connection.query("SELECT * FROM employees", function(err, res) {
        console.table(res);
        init();
    })
}

function updateEmployeeRole() {
	init();
}