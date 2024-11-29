-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2024 at 09:06 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salesrecord`
--

-- --------------------------------------------------------

--
-- Table structure for table `animals`
--

CREATE TABLE `animals` (
  `ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Category` varchar(50) NOT NULL,
  `Breed` varchar(100) NOT NULL,
  `DoB` date NOT NULL,
  `Gender` enum('Male','Female') NOT NULL,
  `Registration` varchar(100) DEFAULT NULL,
  `Color` varchar(50) NOT NULL,
  `ListPrice` decimal(10,2) NOT NULL,
  `SalePrice` decimal(10,2) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animals`
--

INSERT INTO `animals` (`ID`, `Name`, `Category`, `Breed`, `DoB`, `Gender`, `Registration`, `Color`, `ListPrice`, `SalePrice`, `Tax`) VALUES
(1, 'Max', 'Dog', 'Golden Retriever', '2022-01-15', 'Male', 'AKC123456', 'Golden', 1500.00, NULL, NULL),
(2, 'Luna', 'Cat', 'Persian', '2022-03-20', 'Female', 'CFA789012', 'White', 800.00, NULL, NULL),
(3, 'Chibo', 'Dog', 'Pomeranian', '2024-11-29', 'Male', '', 'Brown Gold', 3000.00, 3000.00, NULL),
(4, 'Max', 'Dog', 'Golden Retriever', '2022-01-15', 'Male', 'AKC123456', 'Golden', 1500.00, NULL, NULL),
(5, 'Luna', 'Cat', 'Persian', '2022-03-20', 'Female', 'CFA789012', 'White', 800.00, NULL, NULL),
(6, 'Why Pie', 'Cat', 'Big Bone Persian', '2021-02-20', 'Male', 'C91238231', 'Gray', 5000.00, 5000.00, 500.00);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Address` text NOT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `Name`, `Address`, `Phone`) VALUES
(1, 'John Doe', '123 Main St, City', '123-456-7890'),
(2, 'Jane Smith', '456 Oak Ave, Town', '098-765-4321'),
(3, 'Arvey Pelayo', 'Angeles City Pampanga', '1234 567 8912');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Position` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`EmployeeID`, `Name`, `Position`) VALUES
(1, 'Jerico Sison', 'Veterinarian'),
(2, 'Asian Uanan', 'Sales Associate'),
(3, 'Jeanne Bennedict Soriano', 'Sales Associate'),
(4, 'Arvey Pelayo', 'Sales Associate'),
(5, 'Daniel Garcia', 'Pet Photographer'),
(6, 'David Faith', 'Sales Associate'),
(7, 'Rodmar Gueco', 'Sales Associate');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `product` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `tax` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `product`, `quantity`, `price`, `total`, `date`, `tax`) VALUES
(1, 'Dog Food', 5, 25.99, 129.95, '2024-11-28 07:08:14', 13.00),
(2, 'Cat Food', 3, 15.99, 47.97, '2024-11-28 07:08:14', 4.80),
(3, 'Pet Shampoo', 2, 12.50, 25.00, '2024-11-28 07:08:14', 2.50),
(4, 'Vitamins', 10, 8.99, 89.90, '2024-11-28 07:08:14', 8.99),
(5, 'Pet Toys', 4, 5.99, 23.96, '2024-11-28 07:08:14', 2.40),
(6, 'Anti Rabies', 35, 2593.00, 90755.00, '2024-11-28 07:08:35', 9075.50),
(7, 'Washout', 2, 350.00, 700.00, '2024-11-28 12:55:29', 70.00);

-- --------------------------------------------------------

--
-- Table structure for table `salesinformation`
--

CREATE TABLE `salesinformation` (
  `SalesNo` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `EmployeeID` int(11) NOT NULL,
  `SaleDate` date NOT NULL,
  `AnimalID` int(11) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salesinformation`
--

INSERT INTO `salesinformation` (`SalesNo`, `CustomerID`, `EmployeeID`, `SaleDate`, `AnimalID`, `Tax`) VALUES
(1, 3, 2, '2024-11-29', 6, 500.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`EmployeeID`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salesinformation`
--
ALTER TABLE `salesinformation`
  ADD PRIMARY KEY (`SalesNo`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `AnimalID` (`AnimalID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `EmployeeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `salesinformation`
--
ALTER TABLE `salesinformation`
  MODIFY `SalesNo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `salesinformation`
--
ALTER TABLE `salesinformation`
  ADD CONSTRAINT `salesinformation_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  ADD CONSTRAINT `salesinformation_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
  ADD CONSTRAINT `salesinformation_ibfk_3` FOREIGN KEY (`AnimalID`) REFERENCES `animals` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
