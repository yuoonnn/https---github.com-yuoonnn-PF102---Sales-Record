<?php
require_once 'config.php';

class Database {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Customer-related methods
    public function getAllCustomers() {
        $stmt = $this->pdo->query("SELECT * FROM Customers ORDER BY Name");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addCustomer($name, $address, $phone) {
        $sql = "INSERT INTO Customers (Name, Address, Phone) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$name, $address, $phone]);
    }

    // Employee-related methods
    public function getAllEmployees() {
        $stmt = $this->pdo->query("SELECT * FROM Employees ORDER BY Name");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Animal-related methods
    public function getAllAnimals() {
        $stmt = $this->pdo->query("SELECT * FROM Animals ORDER BY ID DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAnimalById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM Animals WHERE ID = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function addAnimal($name, $category, $breed, $dob, $gender, $registration, $color, $listPrice) {
        $sql = "INSERT INTO Animals (Name, Category, Breed, DoB, Gender, Registration, Color, ListPrice) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$name, $category, $breed, $dob, $gender, $registration, $color, $listPrice]);
    }

    public function recordAnimalSale($animalId, $customerId, $employeeId, $salePrice) {
        try {
            $this->pdo->beginTransaction();

            $tax = $salePrice * 0.10;

            // Record sale information
            $sql = "INSERT INTO SalesInformation (CustomerID, EmployeeID, SaleDate, AnimalID, Tax) 
                    VALUES (?, ?, CURDATE(), ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$customerId, $employeeId, $animalId, $tax]);

            // Update animal's sale price and tax
            $sql = "UPDATE Animals SET SalePrice = ?, Tax = ? WHERE ID = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$salePrice, $tax, $animalId]);

            $this->pdo->commit();
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function getAnimalSales($startDate = null, $endDate = null) {
        $sql = "SELECT 
                    s.SalesNo,
                    s.SaleDate,
                    a.Name as AnimalName,
                    a.Category,
                    a.Breed,
                    c.Name as CustomerName,
                    e.Name as EmployeeName,
                    a.SalePrice,
                    s.Tax
                FROM SalesInformation s 
                JOIN Animals a ON s.AnimalID = a.ID 
                JOIN Customers c ON s.CustomerID = c.CustomerID
                JOIN Employees e ON s.EmployeeID = e.EmployeeID";

        if ($startDate && $endDate) {
            $sql .= " WHERE s.SaleDate BETWEEN ? AND ?";
        }
        
        $sql .= " ORDER BY s.SaleDate DESC";
        
        if ($startDate && $endDate) {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$startDate, $endDate]);
        } else {
            $stmt = $this->pdo->query($sql);
        }
        
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calculate totals
        $subtotal = 0;
        $totalTax = 0;
        
        foreach ($sales as $sale) {
            $subtotal += $sale['SalePrice'];
            $totalTax += $sale['Tax'];
        }
        
        return [
            'sales' => $sales,
            'summary' => [
                'subtotal' => $subtotal,
                'tax' => $totalTax,
                'total' => $subtotal + $totalTax
            ]
        ];
    }

    // Regular sales methods
    public function getAllSales() {
        $stmt = $this->pdo->query("SELECT * FROM sales ORDER BY date DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addSale($product, $quantity, $price) {
        $sql = "INSERT INTO sales (product, quantity, price, total, tax, date) VALUES (?, ?, ?, ?, ?, NOW())";
        $total = $quantity * $price;
        $tax = $total * 0.10;
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$product, $quantity, $price, $total, $tax]);
    }

    public function getSalesByDate($startDate, $endDate) {
        // Get regular sales
        $regularSalesSQL = "SELECT 
            'merchandise' as sale_type,
            date as sale_date,
            product as item_name,
            quantity,
            price,
            total,
            tax
            FROM sales 
            WHERE date BETWEEN ? AND ?";

        // Get animal sales
        $animalSalesSQL = "SELECT 
            'animal' as sale_type,
            s.SaleDate as sale_date,
            a.Name as item_name,
            1 as quantity,
            a.SalePrice as price,
            a.SalePrice as total,
            s.Tax as tax
            FROM SalesInformation s 
            JOIN Animals a ON s.AnimalID = a.ID 
            WHERE s.SaleDate BETWEEN ? AND ?";

        // Combine both queries
        $sql = "($regularSalesSQL) UNION ALL ($animalSalesSQL) ORDER BY sale_date DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$startDate, $endDate, $startDate, $endDate]);
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate subtotals and total
        $animalSubtotal = 0;
        $merchandiseSubtotal = 0;
        $totalTax = 0;

        foreach ($sales as $sale) {
            if ($sale['sale_type'] === 'animal') {
                $animalSubtotal += $sale['total'];
            } else {
                $merchandiseSubtotal += $sale['total'];
            }
            $totalTax += $sale['tax'];
        }

        return [
            'sales' => $sales,
            'summary' => [
                'animal_subtotal' => $animalSubtotal,
                'merchandise_subtotal' => $merchandiseSubtotal,
                'total_tax' => $totalTax,
                'grand_total' => $animalSubtotal + $merchandiseSubtotal + $totalTax
            ]
        ];
    }

    public function getTopProducts() {
        $sql = "SELECT product, SUM(quantity) as total_quantity, SUM(total) as total_sales 
                FROM sales GROUP BY product ORDER BY total_sales DESC LIMIT 5";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
