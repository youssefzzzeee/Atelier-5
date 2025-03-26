// Exercise 1: Asynchronous programming with user data
function fetchUserData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userData = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                avatar: 'avatar.png',
                gender: 'M',
                login: 'john_d',
                password: 'securePassword123',
                address: '123 Main Street, City',
                phone: '+1234567890',
                age: 30,
                occupation: 'Web Developer'
            };
            resolve(userData);
        }, 2000);
    });
}
function displayUserProfile(user) {
    document.getElementById('profile-container').innerHTML = `
        <div class="profile-card">
            <img src="${user.avatar}" alt="${user.name}" class="profile-avatar">
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>Gender: ${user.gender === 'M' ? 'Male' : 'Female'}</p>
        </div>
    `;
}
function displayUsersTable(users) {
    if (!Array.isArray(users)) {
        users = [users];
    }

    const tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Login</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>Occupation</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.login}</td>
                        <td>${user.address}</td>
                        <td>${user.phone}</td>
                        <td>${user.age}</td>
                        <td>${user.occupation}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('users-table-container').innerHTML = tableHTML;
}
function fetchUserOrders(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const orders = [
                { id: 1, product: 'Laptop', price: 1200 },
                { id: 2, product: 'Smartphone', price: 800 },
                { id: 3, product: 'Headphones', price: 150 }
            ];
            resolve(orders);
        }, 1500);
    });
}
function displayUserOrders(orders) {
    const ordersHTML = `
        <h3>User Orders</h3>
        <ul>
            ${orders.map(order => `
                <li>Order #${order.id}: ${order.product} - $${order.price}</li>
            `).join('')}
        </ul>
    `;
    
    document.getElementById('user-orders-container').innerHTML = ordersHTML;
}
async function loadUserDataAndOrders() {
    try {
        const user = await fetchUserData();
        displayUserProfile(user);
        displayUsersTable(user);
        const orders = await fetchUserOrders(user.id);
        displayUserOrders(orders);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('profile-container')) {
        const profileContainer = document.createElement('div');
        profileContainer.id = 'profile-container';
        document.body.appendChild(profileContainer);
    }
    
    if (!document.getElementById('users-table-container')) {
        const tableContainer = document.createElement('div');
        tableContainer.id = 'users-table-container';
        document.body.appendChild(tableContainer);
    }
    
    if (!document.getElementById('user-orders-container')) {
        const ordersContainer = document.createElement('div');
        ordersContainer.id = 'user-orders-container';
        document.body.appendChild(ordersContainer);
    }
    
    loadUserDataAndOrders();
});

// =====================================================================
// Exercise 2: File Upload and Retrieval with Laravel API
// =====================================================================
const API_BASE_URL = 'http://localhost:8000/api';
async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
async function getFilesList() {
    try {
        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching files list:', error);
        throw error;
    }
}

function displayFiles(files) {
    const filesListContainer = document.getElementById('files-list-container');
    
    if (!files || files.length === 0) {
        filesListContainer.innerHTML = '<p>No files found.</p>';
        return;
    }
    
    const filesHTML = `
        <h3>Uploaded Files</h3>
        <ul class="files-list">
            ${files.map(file => `
                <li>
                    <span>${file.name}</span>
                    <a href="${API_BASE_URL}/download/${file.id}" target="_blank">Download</a>
                </li>
            `).join('')}
        </ul>
    `;
    
    filesListContainer.innerHTML = filesHTML;
}

function initializeFileUpload() {
    const fileUploadContainer = document.getElementById('file-upload-container');
    
    const formHTML = `
        <h3>Upload File</h3>
        <form id="file-upload-form">
            <input type="file" id="file-input" required>
            <button type="submit">Upload</button>
        </form>
        <div id="upload-status"></div>
    `;
    
    fileUploadContainer.innerHTML = formHTML;
    document.getElementById('file-upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('file-input');
        const statusDiv = document.getElementById('upload-status');
        
        if (!fileInput.files || fileInput.files.length === 0) {
            statusDiv.textContent = 'Please select a file to upload.';
            return;
        }
        const file = fileInput.files[0];
        statusDiv.textContent = 'Uploading...';
        try {
            const result = await uploadFile(file);
            statusDiv.textContent = 'File uploaded successfully!';
            loadFiles();
        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
        }
    });
}
async function loadFiles() {
    try {
        const files = await getFilesList();
        displayFiles(files);
    } catch (error) {
        document.getElementById('files-list-container').innerHTML = 
            `<p>Error loading files: ${error.message}</p>`;
    }
}
function initializeExercise2() {
    document.body.insertAdjacentHTML('beforeend', `
        <hr>
        <h2>Exercise 2: File Management</h2>
        <div id="file-upload-container"></div>
        <div id="files-list-container">Loading files...</div>
    `);
    
    initializeFileUpload();
    loadFiles();
}

// =====================================================================
// Exercise 3: Room Management with Laravel API
// =====================================================================
const ROOMS_API_URL = 'http://localhost:8000/api/rooms';
async function getRooms() {
    try {
        const response = await fetch(ROOMS_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
}
async function getRoom(id) {
    try {
        const response = await fetch(`${ROOMS_API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching room with ID ${id}:`, error);
        throw error;
    }
}
async function createRoom(roomData) {
    try {
        const response = await fetch(ROOMS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(roomData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
}
async function updateRoom(id, roomData) {
    try {
        const response = await fetch(`${ROOMS_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(roomData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating room with ID ${id}:`, error);
        throw error;
    }
}

async function deleteRoom(id) {
    try {
        const response = await fetch(`${ROOMS_API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error deleting room with ID ${id}:`, error);
        throw error;
    }
}
function displayRooms(rooms) {
    const roomsContainer = document.getElementById('rooms-list-container');
    
    if (!rooms || rooms.length === 0) {
        roomsContainer.innerHTML = '<p>No rooms available.</p>';
        return;
    }
    
    const roomsHTML = `
        <table border="1" class="rooms-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${rooms.map(room => `
                    <tr>
                        <td>${room.id}</td>
                        <td>${room.name}</td>
                        <td>${room.capacity}</td>
                        <td>
                            <button class="edit-room-btn" data-id="${room.id}">Edit</button>
                            <button class="delete-room-btn" data-id="${room.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    roomsContainer.innerHTML = roomsHTML;
    document.querySelectorAll('.edit-room-btn').forEach(button => {
        button.addEventListener('click', () => {
            const roomId = button.getAttribute('data-id');
            loadRoomForEdit(roomId);
        });
    });
    document.querySelectorAll('.delete-room-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const roomId = button.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete room with ID ${roomId}?`)) {
                try {
                    await deleteRoom(roomId);
                    loadRooms(); // Refresh the rooms list
                    showMessage('Room deleted successfully', 'success');
                } catch (error) {
                    showMessage(`Error deleting room: ${error.message}`, 'error');
                }
            }
        });
    });
}
function showMessage(message, type = 'info') {
    const messagesContainer = document.getElementById('messages-container');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}
async function loadRoomForEdit(roomId) {
    try {
        const room = await getRoom(roomId);
        document.getElementById('room-id').value = room.id;
        document.getElementById('room-name').value = room.name;
        document.getElementById('room-capacity').value = room.capacity;
        document.getElementById('room-form-title').textContent = 'Edit Room';
        document.getElementById('room-form-submit').textContent = 'Update Room';
        document.getElementById('room-form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showMessage(`Error loading room for edit: ${error.message}`, 'error');
    }
}
function initializeRoomForm() {
    const roomFormContainer = document.getElementById('room-form-container');
    
    const formHTML = `
        <h3 id="room-form-title">Add New Room</h3>
        <form id="room-form">
            <input type="hidden" id="room-id">
            <div class="form-group">
                <label for="room-name">Room Name:</label>
                <input type="text" id="room-name" required>
            </div>
            <div class="form-group">
                <label for="room-capacity">Capacity:</label>
                <input type="number" id="room-capacity" min="1" required>
            </div>
            <button type="submit" id="room-form-submit">Add Room</button>
            <button type="button" id="room-form-reset">Reset</button>
        </form>
    `;
    
    roomFormContainer.innerHTML = formHTML;
    document.getElementById('room-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const roomId = document.getElementById('room-id').value;
        const roomData = {
            name: document.getElementById('room-name').value,
            capacity: parseInt(document.getElementById('room-capacity').value, 10)
        };
        
        try {
            if (roomId) {
                await updateRoom(roomId, roomData);
                showMessage('Room updated successfully', 'success');
            } else {
                await createRoom(roomData);
                showMessage('Room created successfully', 'success');
            }
            
            resetRoomForm();
            loadRooms();
        } catch (error) {
            showMessage(`Error: ${error.message}`, 'error');
        }
    });
    document.getElementById('room-form-reset').addEventListener('click', resetRoomForm);
}

function resetRoomForm() {
    document.getElementById('room-id').value = '';
    document.getElementById('room-name').value = '';
    document.getElementById('room-capacity').value = '';
    document.getElementById('room-form-title').textContent = 'Add New Room';
    document.getElementById('room-form-submit').textContent = 'Add Room';
}

async function loadRooms() {
    try {
        const rooms = await getRooms();
        displayRooms(rooms);
    } catch (error) {
        document.getElementById('rooms-list-container').innerHTML = 
            `<p>Error loading rooms: ${error.message}</p>`;
    }
}
function initializeExercise3() {
    document.body.insertAdjacentHTML('beforeend', `
        <hr>
        <h2>Exercise 3: Room Management</h2>
        <div id="messages-container"></div>
        <div id="room-form-container"></div>
        <h3>Available Rooms</h3>
        <div id="rooms-list-container">Loading rooms...</div>
    `);
    
    initializeRoomForm();
    loadRooms();
}

// =====================================================================
// Exercise 4: Real-time Stock Tracking with WebSockets & Highcharts
// =====================================================================
function initializePusher() {
    const pusher = new Pusher('your-app-key', {
        cluster: 'mt1',
        encrypted: true
    });
    const stocksChannel = pusher.subscribe('stocks');
    stocksChannel.bind('StockUpdated', function(data) {
        console.log('Stock updated:', data);
        loadStocks();
    });
    
    return pusher;
}
const STOCKS_API_URL = 'http://localhost:8000/api/stocks';
async function getStocks() {
    try {
        const response = await fetch(STOCKS_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
}
async function createStock(stockData) {
    try {
        const response = await fetch(STOCKS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(stockData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating stock:', error);
        throw error;
    }
}
async function updateStock(id, stockData) {
    try {
        const response = await fetch(`${STOCKS_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(stockData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating stock with ID ${id}:`, error);
        throw error;
    }
}
async function deleteStock(id) {
    try {
        const response = await fetch(`${STOCKS_API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error deleting stock with ID ${id}:`, error);
        throw error;
    }
}

function initializeStockChart(stocks) {
    Highcharts.chart('stock-chart-container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Real-time Stock Levels'
        },
        xAxis: {
            categories: stocks.map(stock => stock.product_name),
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Quantity'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Stock Level',
            data: stocks.map(stock => stock.quantity)
        }]
    });
}
function displayStocksTable(stocks) {
    const stocksTableContainer = document.getElementById('stocks-table-container');
    
    if (!stocks || stocks.length === 0) {
        stocksTableContainer.innerHTML = '<p>No stocks available.</p>';
        return;
    }
    
    const stocksHTML = `
        <table border="1" class="stocks-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${stocks.map(stock => `
                    <tr>
                        <td>${stock.id}</td>
                        <td>${stock.product_name}</td>
                        <td>${stock.quantity}</td>
                        <td>
                            <button class="edit-stock-btn" data-id="${stock.id}">Edit</button>
                            <button class="delete-stock-btn" data-id="${stock.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    stocksTableContainer.innerHTML = stocksHTML;
    document.querySelectorAll('.edit-stock-btn').forEach(button => {
        button.addEventListener('click', () => {
            const stockId = button.getAttribute('data-id');
            loadStockForEdit(stockId);
        });
    });
    
    document.querySelectorAll('.delete-stock-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const stockId = button.getAttribute('data-id');
            if (confirm(`Are you sure you want to delete this stock item?`)) {
                try {
                    await deleteStock(stockId);
                    loadStocks();
                    showStockMessage('Stock deleted successfully', 'success');
                } catch (error) {
                    showStockMessage(`Error deleting stock: ${error.message}`, 'error');
                }
            }
        });
    });
}
function showStockMessage(message, type = 'info') {
    const messagesContainer = document.getElementById('stock-messages-container');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messagesContainer.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}
async function loadStockForEdit(stockId) {
    try {
        const response = await fetch(`${STOCKS_API_URL}/${stockId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const stock = await response.json();
        document.getElementById('stock-id').value = stock.id;
        document.getElementById('product-name').value = stock.product_name;
        document.getElementById('product-quantity').value = stock.quantity;
        document.getElementById('stock-form-title').textContent = 'Edit Stock';
        document.getElementById('stock-form-submit').textContent = 'Update Stock';
        document.getElementById('stock-form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showStockMessage(`Error loading stock for edit: ${error.message}`, 'error');
    }
}
function initializeStockForm() {
    const stockFormContainer = document.getElementById('stock-form-container');
    
    const formHTML = `
        <h3 id="stock-form-title">Add New Stock</h3>
        <form id="stock-form">
            <input type="hidden" id="stock-id">
            <div class="form-group">
                <label for="product-name">Product Name:</label>
                <input type="text" id="product-name" required>
            </div>
            <div class="form-group">
                <label for="product-quantity">Quantity:</label>
                <input type="number" id="product-quantity" min="0" required>
            </div>
            <button type="submit" id="stock-form-submit">Add Stock</button>
            <button type="button" id="stock-form-reset">Reset</button>
        </form>
    `;
    stockFormContainer.innerHTML = formHTML;
    document.getElementById('stock-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const stockId = document.getElementById('stock-id').value;
        const stockData = {
            product_name: document.getElementById('product-name').value,
            quantity: parseInt(document.getElementById('product-quantity').value, 10)
        };
        
        try {
            if (stockId) {
                await updateStock(stockId, stockData);
                showStockMessage('Stock updated successfully', 'success');
            } else {
                await createStock(stockData);
                showStockMessage('Stock created successfully', 'success');
            }
            resetStockForm();
            loadStocks();
        } catch (error) {
            showStockMessage(`Error: ${error.message}`, 'error');
        }
    });
    document.getElementById('stock-form-reset').addEventListener('click', resetStockForm);
}
function resetStockForm() {
    document.getElementById('stock-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('stock-form-title').textContent = 'Add New Stock';
    document.getElementById('stock-form-submit').textContent = 'Add Stock';
}
async function loadStocks() {
    try {
        const stocks = await getStocks();
        initializeStockChart(stocks);
        displayStocksTable(stocks);
    } catch (error) {
        document.getElementById('stocks-table-container').innerHTML = 
            `<p>Error loading stocks: ${error.message}</p>`;
        console.error('Error loading stocks for chart:', error);
    }
}
function initializeExercise4() {
    document.body.insertAdjacentHTML('beforeend', `
        <hr>
        <h2>Exercise 4: Real-time Stock Tracking</h2>
        <div id="stock-messages-container"></div>
        <div id="stock-form-container"></div>
        <div id="stock-chart-container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        <h3>Stock Items</h3>
        <div id="stocks-table-container">Loading stocks...</div>
    `);
    initializePusher();
    initializeStockForm();
    loadStocks();
function loadExternalScripts() {
    const highchartsScript = document.createElement('script');
    highchartsScript.src = 'https://code.highcharts.com/highcharts.js';
    document.head.appendChild(highchartsScript);
    const pusherScript = document.createElement('script');
    pusherScript.src = 'https://js.pusher.com/7.0/pusher.min.js';
    document.head.appendChild(pusherScript);
    highchartsScript.onload = pusherScript.onload = function() {
        if (window.Highcharts && window.Pusher) {
            console.log('External scripts loaded successfully');
        }
    };
}
document.addEventListener('DOMContentLoaded', () => {
    loadExternalScripts();
    if (!document.getElementById('profile-container')) {
        const profileContainer = document.createElement('div');
        profileContainer.id = 'profile-container';
        document.body.appendChild(profileContainer);
    }
    if (!document.getElementById('users-table-container')) {
        const tableContainer = document.createElement('div');
        tableContainer.id = 'users-table-container';
        document.body.appendChild(tableContainer);
    }
    if (!document.getElementById('user-orders-container')) {
        const ordersContainer = document.createElement('div');
        ordersContainer.id = 'user-orders-container';
        document.body.appendChild(ordersContainer);
    }
    loadUserDataAndOrders();
    initializeExercise2();
    initializeExercise3();
    const checkScriptsLoaded = setInterval(() => {
        if (window.Highcharts && window.Pusher) {
            clearInterval(checkScriptsLoaded);
            initializeExercise4();
        }
    }, 100);
})};