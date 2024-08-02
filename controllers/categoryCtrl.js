import Category from "../models/categorymodel.js"


const createCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(200).json({ success: true, newCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "delete category successfull", deletedCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, updatedCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

export { createCategory, deleteCategory, updateCategory, getCategory, getAllCategory }