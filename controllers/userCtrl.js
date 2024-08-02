import { generateToken } from "../config/jwtToken.js";
import user from "../models/userModel.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendMail } from "./mailCtrl.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { log } from "console";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
import uniqid from 'uniqid';


//auth user
const createUser = async (req, res) => {
    try {
        const { email, mobile, firstname, lastname, password, role } = req.body;

        const findMobile = await user.findOne({ mobile: mobile })
        const findEmail = await user.findOne({ email: email });

        if (findMobile || findEmail) {
            if (findMobile && findEmail) {
                // return res.status(400).json({ success: false, message: "user already exist" })
                throw new Error("user already exist");
            }
            if (findEmail) {
                throw new Error("user already exist on mail id")
            }
            throw new Error("user already exist on mobile number");
        }

        const securepassword = await bcrypt.hash(password, 12);


        //1way create new User
        const newUser = new user({
            firstname: firstname,
            lastname: lastname,
            email: email,
            mobile: mobile,
            password: securepassword,
            role: role,
        });



        await newUser.save();


        //2nd way to create user
        // const newUser = await user.create(req.body);

        return res.status(200).json({ success: true, newUser });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const loginUserCtrl = async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = await user.findOne({ email });

        if (User) {
            const isMatch = await bcrypt.compare(password, User.password);
            if (isMatch) {
                const auth_Token = generateToken(User?._id);
                const updatedUser = await user.findByIdAndUpdate(User.id, {
                    auth_Token: auth_Token
                }, { new: true });
                res.cookie("auth_Token", auth_Token, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000
                });
                return res.status(200).json({
                    success: true, message: "login successfull",
                    auth_Token: auth_Token, user: updatedUser
                });
            } else {
                throw new Error("password incorrect");
            }
        }
        throw new Error("User Not Found");

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}




const loginAdminCtrl = async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = await user.findOne({ email });

        if (User.role !== "admin") {
            throw new Error("You are not an admin")
        }

        if (User) {
            const isMatch = await bcrypt.compare(password, User.password);
            if (isMatch) {
                const auth_Token = generateToken(User?._id);
                const updatedUser = await user.findByIdAndUpdate(User.id, {
                    auth_Token: auth_Token
                }, { new: true });
                res.cookie("auth_Token", auth_Token, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000
                });
                return res.status(200).json({
                    success: true, message: "login successfull",
                    auth_Token: auth_Token, admin: updatedUser
                });
            } else {
                throw new Error("password incorrect");
            }
        }
        throw new Error("User Not Found");

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}




//fetch user Ctrl
const getAllUser = async (req, res) => {
    try {
        const getUser = await user.find();
        return res.status(200).json({ success: true, message: "fetch all user successfully", users: getUser });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const getUserFromToken = async (req, res) => {
    const { _id } = req.user
    try {
        const getUser = await user.findById(_id).populate('wishlist');
        return res.json({ user: getUser });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const getUserFromParams = async (req, res) => {
    const { id } = req.params;
    try {
        const getUser = await user.findById(id);
        return res.json({ user: getUser });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}






//delete user Ctrl
const deleteAllUserCtrl = async (req, res) => {
    try {
        await user.deleteMany({});
        return res.status(200).json({ success: true, message: "All User Deleted" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await user.findByIdAndDelete(id);
        return res.json({ success: true, message: "delete user successfully", deletedUser: deleteUser });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}







//update user Ctrl
const updateUser = async (req, res) => {
    const { _id } = req.user;
    // const { firstname, lastname, email, mobile, password } = req.body;

    const updatedUser = await user.findByIdAndUpdate(_id, req.body, { new: true });

    return res.json({ success: true, updatedUser: updatedUser });
}








//block and anblock user
const blockUser = async (req, res) => {
    const { id } = req.params;
    try {
        const blockuser = await user.findByIdAndUpdate(id, {
            isBlocked: true,
        }, { new: true })
        return res.json({ success: true, message: "block user successfully", blockUser: blockuser })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const unblockUser = async (req, res) => {
    const { id } = req.params;
    try {
        const unblockuser = await user.findByIdAndUpdate(id, {
            isBlocked: false,
        }, { new: true })
        return res.json({ success: true, message: "unblock user successfully", blockUser: unblockuser })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}







//logout user
const logout = async (req, res) => {
    try {
        const cookie = req.cookies
        if (!cookie.auth_Token) {
            return res.status(401).json({ success: false, message: "you are not logged in" });
        }
        const auth_Token = cookie.auth_Token
        const User = await user.findOne({ auth_Token: auth_Token })
        if (!User) {
            res.clearCookie("auth_Token", {
                httpOnly: true,
                secure: true,
            });
            return res.sendStatus(204);
        }
        await User.updateOne({ auth_Token: "" });
        res.clearCookie("auth_Token", {
            httpOnly: true,
            secure: true,
        });
        return res.json({ success: true, message: "logout successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}





const updatePassword = async (req, res) => {
    const { _id } = req.user
    try {
        const { oldpassword, newpassword } = req.body;

        if (!oldpassword) {
            throw new Error("provide old password")
        }
        if (!newpassword) {
            throw new Error("provide new password");
        }

        const User = await user.findOne({ _id: _id });
        if (!User) {
            throw new Error("user not found")
        }

        const isMatch = await bcrypt.compare(oldpassword, User.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "old password is incorrect" })
        }


        const hashPassword = await bcrypt.hash(newpassword, 12);
        const updateduser = await user.findOneAndUpdate({ _id }, { password: hashPassword }, { new: true });
        return res.json({ success: true, message: "password updated successfully", updateduser });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}





const forgotPasswordToken = async (req, res) => {
    const { email } = req.body;

    try {
        const User = await user.findOne({ email });
        if (!User) {
            throw new Error("user not found with this email");
        }

        //generate token 
        const resetToken = crypto.randomBytes(32).toString('hex');


        // Set the reset token and its expiration time
        User.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
        User.passwordResetExpires = Date.now() + 30 * 60 * 1000 // 10 minute

        await User.save();

        const data = {
            to: User.email,
            subject: 'Password Reset',
            text: 'hey user',
            htm: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://${req.headers.host}/api/user/reset-password/${resetToken}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        }

        await sendMail(data);
        res.json(resetToken);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const resetPassword = async (req, res) => {
    const { newpassword } = req.body;
    const { token } = req.params;

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest('hex');
        const User = await user.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
        if (!User) {
            throw new Error("password reset token is invalid or expired");
        }
        const hashPassword = await bcrypt.hash(newpassword, 12);

        User.password = hashPassword;
        User.passwordResetToken = undefined;
        User.passwordResetExpires = undefined;
        User.passwordChangedAt = Date.now();

        User.save();

        res.json({ success: true, message: "password reset successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const getWishList = async (req, res) => {
    try {
        const { _id } = req.user;

        const findUserwishlist = await user.findById(_id).populate('wishlist');
        res.status(200).json({ Userwishlist: findUserwishlist })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const saveAddress = async (req, res) => {
    try {
        const { _id } = req.user;
        const { address } = req.body;
        const findUser = await user.findById(_id);
        findUser.address.push(address);
        findUser.save();
        res.status(200).json({ success: true, message: "Address saved successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { _id } = req.user;
        const { addressIndex } = req.body;
        const findUser = await user.findById(_id);

        if (addressIndex < 0 || addressIndex >= findUser.address.length) {
            return res.status(400).json({ success: false, message: "Address index is invalid" });
        }

        findUser.address.splice(addressIndex, 1);

        findUser.save();

        res.status(200).json({ success: true, message: "Address saved successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const updateAddress = async (req, res) => {
    try {
        const { _id } = req.user;
        const { addressIndex } = req.body;
        const { address } = req.body;
        const findUser = await user.findById(_id);

        if (addressIndex < 0 || addressIndex >= findUser.address.length) {
            return res.status(400).json({ success: false, message: "Address index is invalid" });
        }

        findUser.address[addressIndex] = address;
        findUser.save();

        res.status(200).json({ success: true, message: "user update successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const getAddress = async (req, res) => {
    try {
        const { _id } = req.user;

        const finduser = await user.findById(_id);

        res.status(200).json({ userAddress: finduser.address.map((item, index) => { return `${index + 1} address = ${item}` }) });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const userCart = async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;

    let products = [];
    const User = await user.findById(_id);

    // check user already have cart product
    const alreadyExist = await Cart.findOne({ user: User._id });
    if (alreadyExist) {
        alreadyExist.remove();
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
        object.price = getPrice.price;

        products.push(object);
    }

    let cartTotal = 0;
    for (let index = 0; index < products.length; index++) {
        cartTotal += products[index].price * products[index].count;
    }


    let newCart = new Cart({
        products: products,
        cartTotal: cartTotal,
        user: User?._id
    })

    await newCart.save();
    res.status(200).json({ success: true, newCart })
}

const getUsercart = async (req, res) => {
    try {
        const { _id } = req.user;

        const cart = await Cart.findOne({ user: _id }).populate("products.product");

        res.status(200).json({ cart })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const emptyCart = async (req, res) => {
    try {
        const { _id } = req.user;

        const User = await user.findOne({ _id })
        const cart = await Cart.findOneAndDelete({ user: User._id });

        res.status(200).json({ deltedcart: cart })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const applyCoupon = async (req, res) => {
    try {
        const { _id } = req.user;
        const { coupon } = req.body;
        const User = await user.findOne({ _id })

        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
            throw new Error("Invalid Coupon");
        }

        let { products, cartTotal } = await Cart.findOne({ user: User._id }).populate("products.product").exec();

        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

        const updatedcart = await Cart.findOneAndUpdate({ user: User._id }, { totalAfterDiscount }, { new: true });

        res.status(200).json({ updatedcart })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const createorder = async (req, res) => {
    try {
        const { COD, couponApplied } = req.body;
        const { _id } = req.user;

        if (!COD) {
            throw new Error("Please pay with COD")
        }
        const User = await user.findOne({ _id })
        const userCart = await Cart.findOne({ user: User._id });

        let finalAmount = 0;

        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash On Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderBy: User._id,
            orderStatus: "Order Placed",
        })

        await newOrder.save();

        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        await Product.bulkWrite(update, {});
        await Cart.findOneAndDelete({ user: User._id });
        res.status(200).json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const getOrder = async (req, res) => {
    try {
        const { _id } = req.user;

        const userOrder = await Order.findOne({ orderBy: _id }).populate('products.product').exec();

        res.status(200).json({ userOrder })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const updateOrderSatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updateStatus = await Order.findByIdAndUpdate(id, {
            orderStatus: status
        }, { new: true })

        res.status(200).json({ updateStatus });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

export { createUser, loginUserCtrl, getAllUser, deleteAllUserCtrl, getUserFromToken, getUserFromParams, deleteUser, updateUser, blockUser, unblockUser, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdminCtrl, getWishList, saveAddress, deleteAddress, updateAddress, getAddress, userCart, getUsercart, emptyCart, applyCoupon, createorder, getOrder, updateOrderSatus };