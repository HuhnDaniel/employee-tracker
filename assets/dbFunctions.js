const connection = require(`./connection`);

const db = {
    findAllEmployees: function() {
        return connection.query(
            `SELECT  e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ' , m. last_name) AS Manager
            FROM employees e
            LEFT JOIN employees m ON e.manager_id = m.id
            INNER JOIN roles r ON e.role_id = r.id
            INNER JOIN departments d ON r.department_id = d.id`
        );
    },

    findAllRoles: function() {
        return connection.query(
            `SELECT roles.id, roles.title, roles.salary, departments.name AS department
            FROM roles
            INNER JOIN departments ON roles.department_id = departments.id`
        );
    },

    findAllDepartments: function() {
        return connection.query(
            `SELECT * FROM departments`
        );
    },

    addNewEmployee: function(firstName, lastName, employeeRole, employeeManager) {
        return connection.query(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
            [firstName, lastName, employeeRole, employeeManager]
        );
    },

    addNewDepartment: function(departmentName) {
        return connection.query(
            `INSERT INTO departments (name) VALUES (?)`,
            departmentName
        );
    },

    addNewRole: function(roleTitle, roleSalary, departmentUnder) {
        return connection.query(
            `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`,
            [roleTitle, roleSalary, departmentUnder]
        );
    },

    modifyRole: function(employeeChosen, newRole) {
        return connection.query(
            `UPDATE employees
            SET role_id = ?
            WHERE id = ?`,
            [newRole, employeeChosen]
        );
    },

    end: function() {
        return connection.end();
    }
}

module.exports = db;