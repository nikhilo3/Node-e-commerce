import userModel from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await userModel.findOne({ email });
    try {
        if (adminUser.role !== "admin") {
            throw new Error("you are not admin");
        } else {
            next();
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

export { isAdmin }