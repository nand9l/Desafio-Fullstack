const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name, price, quantity, category } = req.body;
        
        // Criar produto
        const product = new Product({ name, price, quantity, category });
        await product.save();

        // Buscar e retornar o produto já populado com a categoria
        const populatedProduct = await Product.findById(product._id).populate('category', 'name');

        res.status(201).json(populatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, category } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, quantity, category }, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Produto não encontrado' });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: 'Produto não encontrado' });
        res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};