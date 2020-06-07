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
    }
}

module.exports = db;