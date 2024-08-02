import slugify from "slugify";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { cloundinarydeleteImg, cloundinaryUploadImg } from "../utils/cloundinary.js";
import fs from "fs/promises";  // Use the promise-based fs module
import path from "path";

//create product
const createProduct = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title)
        const newProduct = await Product.create(req.body);
        res.status(200).json({ success: true, newProduct });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}





//get product
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            throw new Error("provide product id");
        }
        const findProduct = await Product.findById(id);
        res.status(200).json({
            success: true,
            product: findProduct
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const getAllProduct = async (req, res) => {
    try {
        //1st way to filter
        // const products = await Product.find(req.query);

        //2nd way to filter
        // const products = await Product.find({      
        //     brand:req.query.brand,
        //     category:req.query.category
        // });

        //3rd way to filter
        // const products = await Product.where("category").equals(req.query.category);


        //filter
        const queryObj = { ...req.query };

        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        const exclude = excludeFields.forEach((value) => {
            delete queryObj[value];
        })

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));


        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            console.log(sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }


        //limiting feilds
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }


        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new Error("this page does not exist");
            }
        }

        const products = await query;
        res.status(200).json({ success: true, products });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}





//update product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            throw new Error("provide product id");
        }
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }

        const updatedproduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
        return res.status(200).json({ success: true, updatedproduct: updatedproduct });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}





//deleteProduct
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            throw new Error("provide product id");
        }
        const deleteproduct = await Product.findOneAndDelete({ _id: id });
        return res.status(200).json({ success: true, message: "product deleted successfully", deleteproduct });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const addToWishlist = async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;
    try {
        if (!productId) {
            throw new Error("provide product id");
        }
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === productId);
        if (alreadyadded) {
            const user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: productId }
            }, { new: true })
            res.json({ user });
        } else {
            const user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: productId }
            }, { new: true })
            res.json({ user });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const rating = async (req, res) => {
    try {
        const { _id } = req.user
        const { productId, star, comment } = req.body;
        const product = await Product.findById(productId);

        const alreadyrated = product.rating.find((rating) => rating.postedby.toString() === _id.toString());
        if (alreadyrated) {
            await Product.updateOne(
                {
                    _id: productId,             // Ensure the correct product
                    "rating.postedby": _id      // Ensure the correct rating by user
                },
                {
                    $set: {
                        "rating.$.star": star,  // Update star rating
                        "rating.$.comment": comment //update comment

                        // "rating.$.review": review,  // Update review
                        // "rating.$.date": date       // Update date
                    }
                },
                { new: true }
            )
        } else {
            await Product.findByIdAndUpdate(productId, {
                $push: {
                    rating: {
                        postedby: _id,
                        star: star,
                        comment: comment
                    }
                }
            }, { new: true });
        }


        const ratingproduct = await Product.findById(productId);

        let totalRating = ratingproduct.rating.length;
        ratingproduct.totalrating = totalRating; //save to total rating

        let ratingsum = ratingproduct.rating.map((item) => item.star).reduce((prev, current) => prev + current, 0);

        let averageRating = (ratingsum / totalRating);

        ratingproduct.averagerating = averageRating;
        await ratingproduct.save();

        res.json({ success: true, ratingproduct });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const uploadImages = async (req, res) => {
    try {
        const uploader = (path) => cloundinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;

        // console.log(files);
        for (const file of files) {
            console.log(file);
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            // await fs.unlink(path);
        }

        const images = urls.map((file)=>{
            return file;
        })
        res.status(200).json({ images });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const deleteImages = async (req, res) => {
    try {
        const {id} = req.params;
        const deleteimg = cloundinarydeleteImg(id,"images");
        res.status(200).json({ message:"deleted" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }

}


export { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages ,deleteImages};