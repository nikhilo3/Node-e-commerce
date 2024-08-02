import express from "express";
import { createBlog, deleteBlog, disLikeBlog, getAllBlog, getBlog, likeBlog, updateBlog, uploadImages } from "../controllers/blogCtrl.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/adminCheck.js";
import { blogImgResize, uploadPhoto } from "../middlewares/uploadImages.js";

const blogRouter = express.Router();

blogRouter.post('/create', verifyToken, isAdmin, createBlog);
blogRouter.put('/update/:id', verifyToken, isAdmin, updateBlog);

blogRouter.get('/get/:id', getBlog);
blogRouter.get('/getall/', getAllBlog);

blogRouter.delete('/delete/:id', verifyToken, isAdmin, deleteBlog);

blogRouter.put('/likes', verifyToken, likeBlog);
blogRouter.put('/dislikes', verifyToken, disLikeBlog);

blogRouter.put('/upload/:id', verifyToken, isAdmin, uploadPhoto.array("images", 10), blogImgResize, uploadImages);

export default blogRouter;