
// Elementos do DOM para categorias
const categoryForm = document.getElementById('categoryForm');
const categoriesList = document.getElementById('categoriesList');
const categorySelect = document.getElementById('productCategory');

// Carregar categorias ao iniciar
document.addEventListener('DOMContentLoaded', loadCategories);

// Formulário de Categoria
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDescription').value;

    const category = { name, description };

    try {
        let response;
        if (id) {
            response = await fetch(`${CATEGORIES_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
        } else {
            response = await fetch(CATEGORIES_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });

            const newCategory = await response.json();
            addCategoryToTable(newCategory); // Adicionar diretamente à tabela
        }

        categoryForm.reset();
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

        categories.forEach(category => addCategoryToTable(category));
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Adicionar categoria à tabela
function addCategoryToTable(category) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${category.name}</td>
        <td>${category.description}</td>
        <td>
            <button onclick="editCategory('${category._id}', '${category.name}', '${category.description}')">Editar</button>
            <button onclick="deleteCategory('${category._id}', this)">Excluir</button>
        </td>
    `;
    categoriesList.appendChild(row);

    const option = document.createElement('option');
    option.value = category._id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
}

// Editar categoria
function editCategory(id, name, description) {
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryName').value = name;
    document.getElementById('categoryDescription').value = description;
}

// Excluir categoria
async function deleteCategory(id, button) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
            await fetch(`${CATEGORIES_URL}/${id}`, { method: 'DELETE' });

            const row = button.closest('tr');
            row.remove();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    }
}
