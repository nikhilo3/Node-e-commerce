import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
    let token;


    // If not in header, check cookies (optional)
    if (!token && req.cookies) {
        token = req.cookies.auth_Token;
        console.log("cookie_token =", token);
    }


    // Check for token in Authorization header (optional, for future use)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log("header_token =", token);
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
            const user = await User.findById(decoded.id);
            req.user = user
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized token" });
        }
    } else {
        return res.status(401).send({ message: "No token provided login first" });
    }


}

export { verifyToken }