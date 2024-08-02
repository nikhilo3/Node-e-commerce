import Coupon from "../models/couponModel.js"




const createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(200).json({ success: true, newCoupon });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

const getAllCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const updateCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, coupon });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}


const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(400).json({ success: false, message: "Coupon not found" })
        }
        res.status(200).json({ success: true, message: "Coupon successfull delete", deletedCoupon: coupon });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, stack: error.stack });
    }
}

export { createCoupon, getAllCoupon, updateCoupon, deleteCoupon }