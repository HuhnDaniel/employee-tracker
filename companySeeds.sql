USE company_db;

INSERT INTO department (`name`)
	VALUES ("Sales")
		, ("Engineering")
        , ("Legal")
        , ("Finance")
;
    
INSERT INTO `role` (title, salary, department_id)
	VALUES ("Sales Lead", 100000, 1)
		, ("Salesperson", 80000, 1)
		, ("Lead Engineer", 150000, 2)
        , ("Software Engineer", 120000, 2)
        , ("Account Manager", 140000, 3)
        , ("Accountant", 125000, 3)
        , ("Legal Team Lead", 250000, 4)
        , ("Lawyer", 190000, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
	VALUES ("James", "Jameson", 1, NULL)
		, ("Bob", "Robertson", 2, 1)
        , ("Frank", "Franklin", 3, NULL)
        , ("Steve", "Stevenson", 4, 3)
        , ("Ashley", "Just-Ashley", 5, NULL)
        , ("Carol", "Bingley", 6, 5)
        , ("Dennis", "Jenkins", 7, NULL)
        , ("Denny", "Jenkins", 8 , 7)
;