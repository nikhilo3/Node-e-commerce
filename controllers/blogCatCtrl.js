import BlogCategory from "../models/blogCatModel.js";


const createCategory = async (req, res) => {
    try {
        const newCategory = await BlogCategory.create(req.body);
        res.status(200).json({ success: true, newCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedblogCategory = await BlogCategory.findByIdAndDelete(id);
        if(!deletedblogCategory){
            return res.status(400).json({ success: false, message: "Blog Category not found" })
        }
        res.status(200).json({ success: true, message: "delete BlogCategory successfull", deletedblogCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, updatedCategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const Blogcategory = await BlogCategory.findById(id);
        res.status(200).json({ success: true, Blogcategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const Blogcategory = await BlogCategory.find();
        res.status(200).json({ success: true, Blogcategory });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

export { createCategory, deleteCategory, updateCategory, getCategory, getAllCategory }