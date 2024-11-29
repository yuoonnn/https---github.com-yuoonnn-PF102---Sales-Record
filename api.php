<?php
header('Content-Type: application/json');
require_once 'db.php';

$db = new Database($pdo);
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action) {
    // Customer-related endpoints
    case 'getAllCustomers':
        echo json_encode($db->getAllCustomers());
        break;

    case 'addCustomer':
        $name = $_POST['name'] ?? '';
        $address = $_POST['address'] ?? '';
        $phone = $_POST['phone'] ?? '';
        
        $result = $db->addCustomer($name, $address, $phone);
        echo json_encode(['success' => $result]);
        break;

    // Employee-related endpoints
    case 'getAllEmployees':
        echo json_encode($db->getAllEmployees());
        break;

    // Animal-related endpoints
    case 'getAllAnimals':
        echo json_encode($db->getAllAnimals());
        break;

    case 'getAnimalById':
        $id = $_POST['id'] ?? $_GET['id'] ?? 0;
        echo json_encode($db->getAnimalById($id));
        break;

    case 'addAnimal':
        $name = $_POST['name'] ?? '';
        $category = $_POST['category'] ?? '';
        $breed = $_POST['breed'] ?? '';
        $dob = $_POST['dob'] ?? '';
        $gender = $_POST['gender'] ?? '';
        $registration = $_POST['registration'] ?? '';
        $color = $_POST['color'] ?? '';
        $listPrice = $_POST['listPrice'] ?? 0;
        
        $result = $db->addAnimal($name, $category, $breed, $dob, $gender, $registration, $color, $listPrice);
        echo json_encode(['success' => $result]);
        break;

    case 'recordAnimalSale':
        $animalId = $_POST['animalId'] ?? 0;
        $customerId = $_POST['customerId'] ?? 0;
        $employeeId = $_POST['employeeId'] ?? 0;
        $salePrice = $_POST['salePrice'] ?? 0;
        
        try {
            $result = $db->recordAnimalSale($animalId, $customerId, $employeeId, $salePrice);
            echo json_encode(['success' => $result]);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'getAnimalSales':
        $startDate = $_POST['startDate'] ?? $_GET['startDate'] ?? null;
        $endDate = $_POST['endDate'] ?? $_GET['endDate'] ?? null;
        echo json_encode($db->getAnimalSales($startDate, $endDate));
        break;

    // Regular sales endpoints
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