const SalesEvents = {
  SALE_ADDED: "saleAdded",
  SALES_UPDATED: "salesUpdated",
  ERROR_OCCURRED: "errorOccurred",
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
      this.events[event].forEach((callback) => callback(data));
    }
  }
}

const eventEmitter = new SalesEventEmitter();

class SalesManager {
  constructor() {
    this.bindEvents();
    this.loadInitialData();
  }

  bindEvents() {
    document.getElementById("saleForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addSale();
    });

    // Date filter event
    document
      .getElementById("dateFilterForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.filterSalesByDate();
      });

    eventEmitter.on(SalesEvents.SALE_ADDED, () => this.loadAllSales());
    eventEmitter.on(SalesEvents.SALES_UPDATED, () => this.loadTopProducts());
  }

  async addSale() {
    const formData = new FormData(document.getElementById("saleForm"));
    formData.append("action", "addSale");

    try {
      const response = await fetch("api.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        document.getElementById("saleForm").reset();
        this.showMessage("Sale added successfully!", "success");
        eventEmitter.emit(SalesEvents.SALE_ADDED);
      } else {
        throw new Error("Failed to add sale");
      }
    } catch (error) {
      this.showMessage(error.message, "error");
      eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error);
    }
  }

  async loadAllSales() {
    try {
      const response = await fetch("api.php?action=getAllSales");
      const sales = await response.json();
      this.displaySales(sales);
      eventEmitter.emit(SalesEvents.SALES_UPDATED);
    } catch (error) {
      this.showMessage("Error loading sales", "error");
      eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error);
    }
  }

  async filterSalesByDate() {
    const formData = new FormData(document.getElementById("dateFilterForm"));
    formData.append("action", "getSalesByDate");

    try {
      const response = await fetch("api.php", {
        method: "POST",
        body: formData,
      });
      const sales = await response.json();
      this.displaySales(sales);
    } catch (error) {
      this.showMessage("Error filtering sales", "error");
      eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error);
    }
  }

  async loadTopProducts() {
    try {
      const response = await fetch("api.php?action=getTopProducts");
      const products = await response.json();
      this.displayTopProducts(products);
    } catch (error) {
      this.showMessage("Error loading top products", "error");
      eventEmitter.emit(SalesEvents.ERROR_OCCURRED, error);
    }
  }

  displaySales(sales) {
    const tbody = document.querySelector("#salesTable tbody");
    tbody.innerHTML = "";

    sales.forEach((sale) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${sale.date}</td>
                <td>${sale.product}</td>
                <td>${sale.quantity}</td>
                <td>₱${parseFloat(sale.price).toFixed(2)}</td>
                <td>₱${parseFloat(sale.total).toFixed(2)}</td>
            `;
      tbody.appendChild(row);
    });
  }

  displayTopProducts(products) {
    const container = document.getElementById("topProducts");
    container.innerHTML = "<h3>Top 5 Products</h3>";

    const list = document.createElement("ul");
    products.forEach((product) => {
      const item = document.createElement("li");
      item.textContent = `${product.product}: ${
        product.total_quantity
      } units (₱${parseFloat(product.total_sales).toFixed(2)})`;
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type;
    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.className = "";
    }, 3000);
  }

  loadInitialData() {
    this.loadAllSales();
    this.loadTopProducts();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SalesManager();
});
