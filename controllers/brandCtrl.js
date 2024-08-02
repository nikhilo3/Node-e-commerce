import Brand from "../models/brandModel.js";


const createCategory = async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.status(200).json({ success: true, newBrand });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "delete Brand successfull", deletedBrand });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, updatedBrand });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findById(id);
        res.status(200).json({ success: true, brand });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const brand = await Brand.find();
        res.status(200).json({ success: true, brand });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

export { createCategory, deleteCategory, updateCategory, getCategory, getAllCategory }