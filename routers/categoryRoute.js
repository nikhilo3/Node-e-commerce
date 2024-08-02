import express from "express";
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../controllers/categoryCtrl.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/adminCheck.js";

const categoryRouter = express.Router();

categoryRouter.post('/create', verifyToken, isAdmin, createCategory);
categoryRouter.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);
categoryRouter.put('/update/:id', verifyToken, isAdmin, updateCategory);

categoryRouter.get('/get/:id', verifyToken, isAdmin, getCategory);
categoryRouter.get('/getall', verifyToken, isAdmin, getAllCategory);


export default categoryRouter;