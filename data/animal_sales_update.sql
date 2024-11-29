USE salesrecord;


CREATE TABLE IF NOT EXISTS Customers (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Address TEXT NOT NULL,
    Phone VARCHAR(20)
);


CREATE TABLE IF NOT EXISTS Employees (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Position VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS Animals (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Breed VARCHAR(100) NOT NULL,
    DoB DATE NOT NULL,
    Gender ENUM('Male', 'Female') NOT NULL,
    Registration VARCHAR(100),
    Color VARCHAR(50) NOT NULL,
    ListPrice DECIMAL(10, 2) NOT NULL,
    SalePrice DECIMAL(10, 2)
);


CREATE TABLE IF NOT EXISTS SalesInformation (
    SalesNo INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT NOT NULL,
    EmployeeID INT NOT NULL,
    SaleDate DATE NOT NULL,
    AnimalID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (AnimalID) REFERENCES Animals(ID)
);


INSERT INTO Customers (Name, Address, Phone) VALUES
    ('Arvey Pelayo', 'Angeles City, Pampanga', '123-456-7890'),
    ('David Faith', 'Magalang, Pampanga', '098-765-4321');
    ('Rodmar Gueco Abayon', 'San Fernando, Pampanga', '058-735-5421');

INSERT INTO Employees (Name, Position) VALUES
    ('Christian Uanan', 'Veterinarian'),
    ('Jeanne Bennedict Soriano', 'Sales Associate');
    ('Daniel Garcia', 'Sales Associate');
    ('Jerico Sison', 'Sales Associate');

INSERT INTO Animals (Name, Category, Breed, DoB, Gender, Registration, Color, ListPrice, SalePrice) VALUES
    ('Max', 'Dog', 'Golden Retriever', '2022-01-15', 'Male', 'AKC123456', 'Golden', 1500.00, NULL),
    ('Luna', 'Cat', 'Persian', '2022-03-20', 'Female', 'CFA789012', 'White', 800.00, NULL);
