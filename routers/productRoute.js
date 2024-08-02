import express from 'express'
import { addToWishlist, createProduct, deleteImages, deleteProduct, getAllProduct, getProduct, rating, updateProduct, uploadImages } from '../controllers/productCtrl.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/adminCheck.js';
import { productImgResize, uploadPhoto } from '../middlewares/uploadImages.js';

const productRouter = express.Router();


productRouter.post('/create', verifyToken, isAdmin, createProduct);

productRouter.get('/get/:id', getProduct);
productRouter.get('/getall', getAllProduct);

productRouter.put('/update/:id', verifyToken, isAdmin, updateProduct);

productRouter.delete('/delete/:id', verifyToken, isAdmin, deleteProduct);

productRouter.put('/addwishlist', verifyToken, addToWishlist);
productRouter.put('/rating', verifyToken, rating);


productRouter.put('/upload/', verifyToken, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);
productRouter.delete("/delete-img/:id",verifyToken,isAdmin,deleteImages)

export default productRouter;