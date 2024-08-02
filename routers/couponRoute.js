import express from "express";
import { createCoupon, deleteCoupon, getAllCoupon, updateCoupon } from "../controllers/couponCtrl.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/adminCheck.js";

const couponRouter = express.Router();

couponRouter.post('/create', verifyToken, isAdmin, createCoupon);
couponRouter.get('/getall', verifyToken, isAdmin, getAllCoupon);

couponRouter.put('/update/:id', verifyToken, isAdmin, updateCoupon);

couponRouter.delete('/delete/:id', verifyToken, isAdmin, deleteCoupon);

export default couponRouter;