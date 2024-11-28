<?php
header('Content-Type: application/json');
require_once 'db.php';

$db = new Database($pdo);
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action) {
    case 'getAllSales':
        echo json_encode($db->getAllSales());
        break;

    case 'addSale':
        $product = $_POST['product'] ?? '';
        $quantity = $_POST['quantity'] ?? 0;
        $price = $_POST['price'] ?? 0;
        
        $result = $db->addSale($product, $quantity, $price);
        echo json_encode(['success' => $result]);
        break;

    case 'getSalesByDate':
        $startDate = $_POST['startDate'] ?? '';
        $endDate = $_POST['endDate'] ?? '';
        
        echo json_encode($db->getSalesByDate($startDate, $endDate));
        break;

    case 'getTopProducts':
        echo json_encode($db->getTopProducts());
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}
?>
