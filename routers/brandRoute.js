import express from "express";
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../controllers/brandCtrl.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/adminCheck.js";

const brandRouter = express.Router();

brandRouter.post('/create', verifyToken, isAdmin, createCategory);
brandRouter.delete('/delete/:id', verifyToken, isAdmin, deleteCategory);
brandRouter.put('/update/:id', verifyToken, isAdmin, updateCategory);

brandRouter.get('/get/:id', verifyToken, isAdmin, getCategory);
brandRouter.get('/getall', verifyToken, isAdmin, getAllCategory);


export default brandRouter;