<?php
require_once 'config.php';

class Database {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAllSales() {
        $stmt = $this->pdo->query("SELECT * FROM sales ORDER BY date DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addSale($product, $quantity, $price) {
        $sql = "INSERT INTO sales (product, quantity, price, total, date) VALUES (?, ?, ?, ?, NOW())";
        $total = $quantity * $price;
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$product, $quantity, $price, $total]);
    }

    public function getSalesByDate($startDate, $endDate) {
        $sql = "SELECT * FROM sales WHERE date BETWEEN ? AND ? ORDER BY date DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$startDate, $endDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTopProducts() {
        $sql = "SELECT product, SUM(quantity) as total_quantity, SUM(total) as total_sales 
                FROM sales GROUP BY product ORDER BY total_sales DESC LIMIT 5";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
