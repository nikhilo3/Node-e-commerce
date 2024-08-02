import express from "express";
import { applyCoupon, blockUser, createorder, createUser, deleteAddress, deleteAllUserCtrl, deleteUser, emptyCart, forgotPasswordToken, getAddress, getAllUser, getOrder, getUsercart, getUserFromParams, getUserFromToken, getWishList, loginAdminCtrl, loginUserCtrl, logout, resetPassword, saveAddress, unblockUser, updateAddress, updateOrderSatus, updatePassword, updateUser, userCart } from "../controllers/userCtrl.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/adminCheck.js";


const userrouter = express.Router();

userrouter.post('/register', createUser);
userrouter.post('/login', loginUserCtrl);
userrouter.post('/admin-login', loginAdminCtrl);

userrouter.get('/all-user', getAllUser);
userrouter.get('/getuser', verifyToken, getUserFromToken);
// userrouter.get('/getadmin', verifyToken, isAdmin, getUserFromToken);
userrouter.get('/userid/:id', verifyToken, isAdmin, getUserFromParams);

userrouter.delete('/removealluser', deleteAllUserCtrl);
userrouter.delete('/deleteuser/:id', deleteUser);

userrouter.patch('/updateuser', verifyToken, updateUser);

userrouter.put('/blockuser/:id', verifyToken, isAdmin, blockUser);
userrouter.put('/unblockuser/:id', verifyToken, isAdmin, unblockUser);

userrouter.put('/updatepassword', verifyToken, updatePassword);

userrouter.post('/forgot-password-token', forgotPasswordToken);
userrouter.put('/reset-password/:token', resetPassword);

userrouter.get('/logout', logout)

userrouter.get('/wishlist', verifyToken, getWishList);

userrouter.post('/save-address', verifyToken, saveAddress);
userrouter.delete('/delete-address', verifyToken, deleteAddress);
userrouter.put('/update-address', verifyToken, updateAddress);
userrouter.get('/get-address', verifyToken, getAddress);

userrouter.post('/addtocart', verifyToken, userCart);
userrouter.get('/cart', verifyToken, getUsercart);
userrouter.delete('/clear-cart', verifyToken, emptyCart);

userrouter.post('/cart/apply-coupon', verifyToken, applyCoupon);


userrouter.post('/cart/create-order', verifyToken, createorder);
userrouter.get('/get-order', verifyToken, getOrder);
userrouter.put('/update-order-status/:id', verifyToken,isAdmin, updateOrderSatus);


export default userrouter;