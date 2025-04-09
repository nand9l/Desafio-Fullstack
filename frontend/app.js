// script.js

// URLs da API
const API_BASE_URL = 'http://localhost:3000/api';
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const PRODUCTS_URL = `${API_BASE_URL}/products`;

// Elementos do DOM
const categoryForm = document.getElementById('categoryForm');
const productForm = document.getElementById('productForm');
const categoriesList = document.getElementById('categoriesList');
const productsList = document.getElementById('productsList');
const categorySelect = document.getElementById('productCategory');

// Carregar categorias e produtos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
});

// Formulário de Categoria
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;
    
    const category = { name, description };
    
    try {
        if (id) {
            await fetch(`${CATEGORIES_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
        } else {
            await fetch(CATEGORIES_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
        }
        
        categoryForm.reset();
        loadCategories();
    } catch (error) {
        console.error('Erro ao salvar categoria:', error);
    }
});

// Carregar categorias
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_URL);
        const categories = await response.json();
        
        categoriesList.innerHTML = '';
        categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button onclick="editCategory('${category._id}', '${category.name}', '${category.description}')">Editar</button>
                    <button onclick="deleteCategory('${category._id}')">Excluir</button>
                </td>
            `;
            categoriesList.appendChild(row);
            
            const option = document.createElement('option');
            option.value = category._id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Editar categoria
function editCategory(id, name, description) {
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryName').value = name;
    document.getElementById('categoryDescription').value = description;
}

// Excluir categoria
async function deleteCategory(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
            await fetch(`${CATEGORIES_URL}/${id}`, { method: 'DELETE' });
            loadCategories();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    }
}

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
        let response;
        if (id) {
            response = await fetch(`${PRODUCTS_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } else {
            response = await fetch(PRODUCTS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

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
