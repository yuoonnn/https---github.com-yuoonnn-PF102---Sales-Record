const SalesEvents = {
    SALE_ADDED: "saleAdded",
    SALES_UPDATED: "salesUpdated",
    ERROR_OCCURRED: "errorOccurred",
    ANIMAL_ADDED: "animalAdded",
    ANIMAL_SALE_RECORDED: "animalSaleRecorded",
    CUSTOMER_ADDED: "customerAdded"
};

class SalesEventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

const eventEmitter = new SalesEventEmitter();

// Tab Handling
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
        
        if (button.dataset.tab === 'animal-sales') {
            loadAnimals();
            loadAnimalSales();
            loadCustomers();
            loadEmployees();
        } else {
            loadSales();
        }
    });
});

// Regular Sales Functions
async function addSale(product, quantity, price) {
    try {
        const formData = new FormData();
        formData.append('action', 'addSale');
        formData.append('product', product);
        formData.append('quantity', quantity);
        formData.append('price', price);

        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            eventEmitter.emit(SalesEvents.SALE_ADDED);
            return true;
        }
        throw new Error('Failed to add sale');
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
        return false;
    }
}

async function loadSales() {
    try {
        const startDate = document.getElementById('regularStartDate').value || '1970-01-01';
        const endDate = document.getElementById('regularEndDate').value || new Date().toISOString().split('T')[0];
        
        const formData = new FormData();
        formData.append('action', 'getSalesByDate');
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        displaySales(data.sales);
        updateSalesSummary(data.summary);
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
    }
}

function displaySales(sales) {
    const tbody = document.querySelector('#salesTable tbody');
    tbody.innerHTML = '';

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(sale.sale_date).toLocaleDateString()}</td>
            <td>${sale.item_name}</td>
            <td>${sale.quantity}</td>
            <td>₱${parseFloat(sale.price).toFixed(2)}</td>
            <td>₱${parseFloat(sale.total).toFixed(2)}</td>
            <td>₱${parseFloat(sale.tax).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateSalesSummary(summary) {
    document.getElementById('animalSubtotal').textContent = `₱${parseFloat(summary.animal_subtotal).toFixed(2)}`;
    document.getElementById('merchandiseSubtotal').textContent = `₱${parseFloat(summary.merchandise_subtotal).toFixed(2)}`;
    document.getElementById('totalTax').textContent = `₱${parseFloat(summary.total_tax).toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `₱${parseFloat(summary.grand_total).toFixed(2)}`;
}

// Customer Functions
async function loadCustomers() {
    try {
        const response = await fetch('api.php?action=getAllCustomers');
        const customers = await response.json();
        updateCustomerSelect(customers);
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
    }
}

async function addCustomer(formData) {
    try {
        formData.append('action', 'addCustomer');
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            eventEmitter.emit(SalesEvents.CUSTOMER_ADDED);
            return true;
        }
        throw new Error('Failed to add customer');
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
        return false;
    }
}

function updateCustomerSelect(customers) {
    const select = document.getElementById('customerId');
    select.innerHTML = '<option value="">Select a customer</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.CustomerID;
        option.textContent = customer.Name;
        select.appendChild(option);
    });
}

// Employee Functions
async function loadEmployees() {
    try {
        const response = await fetch('api.php?action=getAllEmployees');
        const employees = await response.json();
        updateEmployeeSelect(employees);
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
    }
}

function updateEmployeeSelect(employees) {
    const select = document.getElementById('employeeId');
    select.innerHTML = '<option value="">Select an employee</option>';
    
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.EmployeeID;
        option.textContent = employee.Name;
        select.appendChild(option);
    });
}

// Animal Functions
async function addAnimal(formData) {
    try {
        formData.append('action', 'addAnimal');
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            eventEmitter.emit(SalesEvents.ANIMAL_ADDED);
            return true;
        }
        throw new Error('Failed to add animal');
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
        return false;
    }
}

async function loadAnimals() {
    try {
        const response = await fetch('api.php?action=getAllAnimals');
        const animals = await response.json();
        updateAnimalSelect(animals);
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
    }
}

async function recordAnimalSale(formData) {
    try {
        formData.append('action', 'recordAnimalSale');
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            eventEmitter.emit(SalesEvents.ANIMAL_SALE_RECORDED);
            return true;
        }
        throw new Error('Failed to record animal sale');
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
        return false;
    }
}

async function loadAnimalSales() {
    try {
        const startDate = document.getElementById('animalStartDate').value || '1970-01-01';
        const endDate = document.getElementById('animalEndDate').value || new Date().toISOString().split('T')[0];
        
        const formData = new FormData();
        formData.append('action', 'getAnimalSales');
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        
        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        displayAnimalSales(data.sales, data.summary);
    } catch (error) {
        eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error.message);
    }
}

function updateAnimalSelect(animals) {
    const select = document.getElementById('animalId');
    select.innerHTML = '<option value="">Select an animal</option>';
    
    animals.forEach(animal => {
        if (!animal.SalePrice) { // Only show unsold animals
            const option = document.createElement('option');
            option.value = animal.ID;
            option.textContent = `${animal.Name} - ${animal.Breed} (${animal.Category})`;
            select.appendChild(option);
        }
    });
}

function displayAnimalSales(sales, summary) {
    const tbody = document.querySelector('#animalSalesTable tbody');
    tbody.innerHTML = '';

    sales.forEach(sale => {
        const salePrice = parseFloat(sale.SalePrice);
        const tax = parseFloat(sale.Tax);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.SalesNo}</td>
            <td>${new Date(sale.SaleDate).toLocaleDateString()}</td>
            <td>${sale.AnimalName}</td>
            <td>${sale.Category}</td>
            <td>${sale.Breed}</td>
            <td>${sale.CustomerName}</td>
            <td>${sale.EmployeeName}</td>
            <td>₱${salePrice.toFixed(2)}</td>
            <td>₱${tax.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    // Update animal sales summary
    document.getElementById('animalSalesSubtotal').textContent = `₱${parseFloat(summary.subtotal).toFixed(2)}`;
    document.getElementById('animalSalesTax').textContent = `₱${parseFloat(summary.tax).toFixed(2)}`;
    document.getElementById('animalSalesTotal').textContent = `₱${parseFloat(summary.total).toFixed(2)}`;
}

// Event Listeners
document.getElementById('filterRegularSales').addEventListener('click', () => {
    loadSales();
});

document.getElementById('filterAnimalSales').addEventListener('click', () => {
    loadAnimalSales();
});

document.getElementById('saleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const success = await addSale(
        form.product.value,
        form.quantity.value,
        form.price.value
    );
    if (success) {
        form.reset();
        loadSales();
    }
});

document.getElementById('animalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await addAnimal(formData);
    if (success) {
        e.target.reset();
        loadAnimals();
    }
});

document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await addCustomer(formData);
    if (success) {
        e.target.reset();
        loadCustomers();
    }
});

document.getElementById('animalSaleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await recordAnimalSale(formData);
    if (success) {
        e.target.reset();
        loadAnimals();
        loadAnimalSales();
    }
});

// Event Handlers
eventEmitter.on(SalesEvents.ERROR_OCCURRED, (message) => {
    alert(`Error: ${message}`);
});

eventEmitter.on(SalesEvents.CUSTOMER_ADDED, () => {
    loadCustomers();
});

// Initial Load
loadSales();
