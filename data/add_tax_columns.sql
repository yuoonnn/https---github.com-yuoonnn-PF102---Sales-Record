USE salesrecord;

-- Add tax column to sales table if it doesn't exist
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS tax DECIMAL(10, 2) DEFAULT 0.00;

-- Add tax column to SalesInformation table if it doesn't exist
ALTER TABLE SalesInformation
ADD COLUMN IF NOT EXISTS Tax DECIMAL(10, 2) DEFAULT 0.00;

-- Add tax column to Animals table if it doesn't exist
ALTER TABLE Animals
ADD COLUMN IF NOT EXISTS Tax DECIMAL(10, 2) DEFAULT NULL;

-- Update existing sales records to include tax
UPDATE sales 
SET tax = total * 0.10 
WHERE tax = 0 OR tax IS NULL;

-- Update existing animal sales records to include tax
UPDATE SalesInformation s
JOIN Animals a ON s.AnimalID = a.ID
SET s.Tax = a.SalePrice * 0.10,
    a.Tax = a.SalePrice * 0.10
WHERE s.Tax = 0 OR s.Tax IS NULL;
