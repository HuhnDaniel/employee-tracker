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

function promptUser() {
	return inquirer.prompt({
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
	});
}

async function init() {
	const { action } = await promptUser();

	switch (action) {
		case "Add department":
			break;
		case "Add role":
			break;
		case "Add employee":
			break;
		case "View department":
			break;
		case "View role":
			break;
		case "View employee":
			break;
		case "Update employee role":
			break;
		case "Exit program":
			connection.end();
			break;
	}
}