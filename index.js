const connection = require(`./assets/connection`);
const { prompt } = require(`inquirer`);
const db = require(`./assets/dbFunctions`);

init();

// Main function that takes user input and directs them accordingly
function init() {
    prompt({
        name: `action`,
        type: `list`,
        message: `What would you like to do?`,
        choices: [
            `View employees`,
            `Add employee`,
            `View departments`,
            `Add department`,
            `View roles`,
            `Add role`,
            `Update employee role`,
            `Exit program`
        ]
    }).then(({ action }) => {
        switch (action) {
            case `View employees`:
                viewEmployees();
                break;
            case `Add employee`:
                addEmployee();
                break;
            case `View departments`:
                viewDepartments();
                break;
            case `Add department`:
                addDepartment();
                break;
            case `View roles`:
                viewRoles();
                break;
            case `Add role`:
                addRole();
                break;
            case `Update employee role`:
                updateEmployeeRole();
                break;
            case `Exit program`:
                connection.end();
                break;
        }
    });
}

// Function to view all employees and their relevant information
async function viewEmployees() {
    const employees = await db.findAllEmployees();

    console.table(employees);

    init();
}

// Function to add an employee
async function addEmployee() {

    // Query to get list of possible managers
    const employees = await db.findAllEmployees();
    const managerChoices = employees.map(
        ({ id, first_name, last_name }) =>
        ({ value: id, name: first_name + ` ` + last_name })
    );
    managerChoices.unshift({ value: null, name: `None` });
    console.log(managerChoices);

        // Query to get a list of possible roles
        connection.query(`SELECT id, title FROM roles`, (err, res) => {
            const roleChoices = res.map(
                ({ id, title }) =>
                ({ value: id, name: title})
            );

            // Prompt for new employee info
            prompt([
                {
                    name: `firstName`,
                    type: `input`,
                    message: `Input new employee's first name: `
                },
                {
                    name: `lastName`,
                    type: `input`,
                    message: `Input new employee's last name: `
                },
                {
                    name: `employeeRole`,
                    type: `list`,
                    message: `What role will the new employee fill?`,
                    choices: roleChoices
                },
                {
                    name: `employeeManager`,
                    type: `list`,
                    message: `Who will be the manager of the new employee?`,
                    choices: managerChoices
                }
            ]).then(({ firstName, lastName, employeeRole, employeeManager }) => {

                // Add new employee info into database
                const queryStr = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                connection.query(queryStr, [firstName, lastName, employeeRole, employeeManager], (err, res) => {
                    console.log(`Added new employee ${firstName} ${lastName}.`);
                    init();
                });
            });
        });
}

// Function to view all departments
async function viewDepartments() {
    const depts = await db.findAllDepartments();

    console.table(depts);

    init();
}

// Function to insert user named department into database
function addDepartment() {
    prompt({
        name: `departmentName`,
        type: `input`,
        message: `Input the name of the department you would like to add: `
    }).then(({ departmentName }) => {
        const queryStr = `INSERT INTO departments (name) VALUES (?)`;
        connection.query(queryStr, departmentName, (err, res) => {
            console.log(`Added new ${departmentName} department.`);
            init();
        });
    });
}

// Function to view all roles
async function viewRoles() {
    const roles = await db.findAllRoles();

    console.table(roles);
    
    init();
}

// Function to add new type of role
function addRole() {

    // Query to find all possible departments that could contain the new role
    connection.query(`SELECT id, name FROM departments`, (err, res) => {
        const departmentChoices = res.map(
            ({ id, name }) => 
            ({ value: id, name: name })
        );
        
        // Prompt for new role info
        prompt([
            {
                name: `roleTitle`,
                type: `input`,
                message: `Input the title of the role you would like to add: `
            },
            {
                name: `roleSalary`,
                type: `input`,
                message: `Input the salary for this role: `
            },
            {
                name: `departmentUnder`,
                type: `list`,
                message: `What department will this role be listed under?`,
                choices: departmentChoices
            }
        ]).then(({ roleTitle, roleSalary, departmentUnder }) => {

            // Query to add new role to database
            const queryStr = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            connection.query(queryStr, [roleTitle, roleSalary, departmentUnder], (err, res) => {
                console.log(`Added new role ${roleTitle} with salary ${roleSalary}.`);
                init();
            });
        });
    });
}

// Function to update the role an employee holds
function updateEmployeeRole() {

    // Query to retrieve all employees list
    connection.query(`SELECT id, first_name, last_name FROM employees`, (err, res) => {
        const employeeChoices = res.map(
            ({ id, first_name, last_name }) =>
            ({ value: id, name: first_name + ` ` + last_name })
        );

        // Query to retrieve all roles list
        connection.query(`SELECT id, title FROM roles`, (err, res) => {
            const roleChoices = res.map(
                ({ id, title }) =>
                ({ value: id, name: title})
            );

            // Prompt for which employee to change to which role
            prompt([
                {
                    name: `employeeChosen`,
                    type: `list`,
                    message: `Which employee's role do you wish to change?`,
                    choices: employeeChoices
                },
                {
                    name: `newRole`,
                    type: `list`,
                    message: `What would you like to change this employee's role to?`,
                    choices: roleChoices
                }
            ]).then(({ employeeChosen, newRole }) => {

                // Query to update database accordingly
                connection.query(
                    `UPDATE employees
                    SET role_id = ?
                    WHERE id = ?`,
                    [newRole, employeeChosen],
                    (err, res) => {
                        console.log(`Successfully changed employee role!`);
                        init();
                    }
                );
            });
        });
    });
}