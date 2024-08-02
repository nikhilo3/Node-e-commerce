import express from "express";
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../controllers/blogCatCtrl.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/adminCheck.js";

const blogCatRouter = express.Router();

blogCatRouter.post('/create', verifyToken, isAdmin, createCategory);
blogCatRouter.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);
blogCatRouter.put('/update/:id', verifyToken, isAdmin, updateCategory);

blogCatRouter.get('/get/:id', verifyToken, isAdmin, getCategory);
blogCatRouter.get('/getall', verifyToken, isAdmin, getAllCategory);


export default blogCatRouter;