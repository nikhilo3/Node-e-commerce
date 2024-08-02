import Blog from "../models/blogModel.js"
import { cloundinaryUploadImg } from "../utils/cloundinary.js";
import fs from "fs/promises";  // Use the promise-based fs module

const createBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(200).json({ success: true, newBlog });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const updateBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, updatedBlog });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const getBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id).populate('likes').populate('disLikes');
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // await blog.updateOne({ numViews: blog.numViews += 1 });

        blog.numViews += 1;
        await blog.save();

        blog.save();
        res.status(200).json({ blog });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const getAllBlog = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('likes').populate('disLikes');
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.status(200).json({ success: true, message: "blog deleted successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}

const likeBlog = async (req, res) => {
    const { blogId } = req.body;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false, message: "Blog not found"
            })
        }

        const loginUserId = req?.user?._id;

        const alreadyDisliked = blog?.disLikes?.find((userId => userId?.toString() === loginUserId.toString()));
        if (alreadyDisliked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { disLikes: loginUserId },
                isDisliked: false
            }, { new: true });
        }


        const isLiked = blog?.isLiked; // true or false
        if (isLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId, { 
                $pull: { likes: loginUserId },
                isLiked: false,
            }, { new: true });

            res.json({ blog })
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId },
                isLiked: true,
            }, { new: true });

            res.json({ blog })
        }
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const disLikeBlog = async (req, res) => {
    const { blogId } = req.body;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false, message: "Blog not found"
            })
        }

        const loginUserId = req?.user?._id;

        const alreadyliked = blog?.likes?.find((userId => userId?.toString() === loginUserId.toString()));
        if (alreadyliked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false
            }, { new: true });
        }


        const isdisLiked = blog?.isDisliked; // true or false
        if (isdisLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { disLikes: loginUserId },
                isDisliked: false,
            }, { new: true });

            res.json({ blog })
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { disLikes: loginUserId },
                isDisliked: true,
            }, { new: true });

            res.json({ blog })
        }
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack })
    }
}


const uploadImages = async (req, res) => {
    const { id } = req.params;
    try {
        const uploader = (path) => cloundinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;

        // console.log(files);
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            // await fs.unlink(path);
        }

        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            })
        }, { new: true })

        res.status(200).json({ findBlog });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }

}


export { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog , disLikeBlog, uploadImages}