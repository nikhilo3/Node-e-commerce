import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";  // Use the promise-based fs module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, callback) {
        const uniquename = Date.now() + "-" + Math.round(Math.random() * 1e9);
        callback(null, file.fieldname + uniquename + ".jpeg");
    },
});

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback({ message: "unsupported file format" }, false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 },
});

const productImgResize = async (req, res, next) => {
    if (!req.files) {
        return next();
    }
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/product/${file.filename}`);
            // await fs.unlink(file.path)
        })
    );
    next();
};

const blogImgResize = async (req, res, next) => {
    if (!req.files) {
        return next();
    }
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/blog/${file.filename}`);
            // await fs.unlink(file.path);
        })
    );
    next();
};

export { uploadPhoto, productImgResize, blogImgResize };