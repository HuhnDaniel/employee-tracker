const connection = require(`./assets/connection`);
const { prompt } = require(`inquirer`);
const db = require(`./assets/dbFunctions`);

init();

// Main function that takes user input and directs them accordingly
async function init() {
    const { action } = await prompt({
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
    });

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
            db.end();
            break;
    }
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

    // Query to get a list of possible roles
    const roles = await db.findAllRoles();
    const roleChoices = roles.map(
        ({ id, title }) =>
        ({ value: id, name: title})
    );

    // Prompt for new employee info
    const { firstName, lastName, employeeRole, employeeManager } = await prompt([
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
    ]);

    // Add new employee info into database
    await db.addNewEmployee(firstName, lastName, employeeRole, employeeManager);

    console.log(`Added new employee ${firstName} ${lastName}.`);

    init();
}

// Function to view all departments
async function viewDepartments() {
    const depts = await db.findAllDepartments();

    console.table(depts);

    init();
}

// Function to insert user named department into database
async function addDepartment() {
    const { departmentName } = await prompt({
        name: `departmentName`,
        type: `input`,
        message: `Input the name of the department you would like to add: `
    });

    // Add new department to database
    await db.addNewDepartment(departmentName);
        
    console.log(`Added new ${departmentName} department.`);
    
    init();
}

// Function to view all roles
async function viewRoles() {
    const roles = await db.findAllRoles();

    console.table(roles);
    
    init();
}

// Function to add new type of role
async function addRole() {

    // Query to find all possible departments that could contain the new role
    const depts = await db.findAllDepartments();
    const departmentChoices = depts.map(
        ({ id, name }) => 
        ({ value: id, name: name })
    );
        
    // Prompt for new role info
    const { roleTitle, roleSalary, departmentUnder } = await prompt([
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
    ]);

    // Query to add new role to database
    await db.addNewRole(roleTitle, roleSalary, departmentUnder);

    console.log(`Added new role ${roleTitle} with salary ${roleSalary}.`);

    init();
}

// Function to update the role an employee holds
async function updateEmployeeRole() {

    // Query to retrieve all employees list
    const employees = await db.findAllEmployees();
    const employeeChoices = employees.map(
        ({ id, first_name, last_name }) =>
        ({ value: id, name: first_name + ` ` + last_name })
    );

    // Query to retrieve all roles list
    const roles = await db.findAllRoles();
    const roleChoices = roles.map(
        ({ id, title }) =>
        ({ value: id, name: title})
    );

    // Prompt for which employee to change to which role
    const { employeeChosen, newRole } = await prompt([
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
    ]);

    // Query to update database accordingly
    await db.modifyRole(employeeChosen, newRole);

    console.log(`Successfully changed employee role!`);
            
    init();
}