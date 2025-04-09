
// Elementos do DOM para produtos
const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');

// Carregar produtos ao iniciar
document.addEventListener('DOMContentLoaded', loadProducts);

// Formulário de Produto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value, 10);
    const category = document.getElementById('productCategory').value;

    const product = { name, price, quantity, category };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${PRODUCTS_URL}/${id}` : PRODUCTS_URL;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (!id) {
            const newProduct = await response.json();
            addProductToTable(newProduct);
        }

        productForm.reset();
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
    }
});

// Carregar produtos
async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);
        const products = await response.json();

        productsList.innerHTML = '';
        products.forEach(product => addProductToTable(product));
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Adicionar produto na tabela
function addProductToTable(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.name}</td>
        <td>R$ ${product.price.toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td>${product.category ? product.category.name : 'Sem categoria'}</td>
        <td>
            <button onclick="editProduct('${product._id}', '${product.name}', ${product.price}, ${product.quantity}, '${product.category ? product.category._id : ''}')">Editar</button>
            <button onclick="deleteProduct('${product._id}', this)">Excluir</button>
        </td>
    `;
    productsList.appendChild(row);
}

// Editar produto
function editProduct(id, name, price, quantity, categoryId) {
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = name;
    document.getElementById('productPrice').value = price;
    document.getElementById('productQuantity').value = quantity;
    document.getElementById('productCategory').value = categoryId || '';
}

// Excluir produto
async function deleteProduct(id, button) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            await fetch(`${PRODUCTS_URL}/${id}`, { method: 'DELETE' });

            const row = button.closest('tr');
            row.remove();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    }
}
