
CREATE DATABASE salesrecord;


USE salesrecord;


CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) 


INSERT INTO sales (product, quantity, price, total, date) VALUES
    ('Dog Food', 5, 25.99, 129.95, NOW()),
    ('Cat Food', 3, 15.99, 47.97, NOW()),
    ('Pet Shampoo', 2, 12.50, 25.00, NOW()),
    ('Vitamins', 10, 8.99, 89.90, NOW()),
    ('Pet Toys', 4, 5.99, 23.96, NOW());


