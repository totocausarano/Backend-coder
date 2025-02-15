const socket = io();
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

console.log('Socket client initialized');

// Form submission handler
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value)
    };
    console.log('Sending product:', product);
    socket.emit('addProduct', product);
    productForm.reset();
});


function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}


socket.on('updateProducts', (products) => {
   
    if (Array.isArray(products)) {
        const html = products.map(product => `
            <div class="product-card" id="product-${product.id}">
                <h4>${product.title}</h4>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Code: ${product.code}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
            </div>
        `).join('');
        productList.innerHTML = html;
    } else {
        console.error('Products is not an array:', products);
    }
});
const sentProductButton = document.getElementById("sendProduct");
sentProductButton.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
  };
  socket.emit("newProduct", newProduct);
});
const productContainer = document.getElementById("productsContainer");
socket.on("loadProducts", (products) => {
  products.forEach((product) => {
    cargarProducto(product);
  });
});
socket.on('updateProducts', (products) => {
    
    if (Array.isArray(products)) {
        const html = products.map(product => `
            <div class="product-card" id="product-${product.id}">
                <h4>${product.title}</h4>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Code: ${product.code}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
            </div>
        `).join('');
        productList.innerHTML = html;
    } else {
        console.error('producto no esta en el array:', products);
    }
});
function cargarProducto(product) {
  const productDiv = document.createElement("p");
  productDiv.textContent = `Title: ${product.title} Description: ${product.description} Price: ${product.price} Code: ${product.code} Stock: ${product.stock}`;
  productContainer.appendChild(productDiv);
}
