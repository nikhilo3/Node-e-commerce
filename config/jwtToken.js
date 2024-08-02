import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRETKEY, { expiresIn: '3d' });
}

export { generateToken };