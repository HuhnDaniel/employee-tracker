var mysql = require(`mysql`);

var connection = mysql.createConnection({
	host: `localhost`,
	port: 3306,
	user: `root`,
	password: `password`,
	database: `company_db`
});

connection.connect((err) => {
	if (err) throw err;
});