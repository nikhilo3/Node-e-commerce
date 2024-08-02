import mongoose from "mongoose";


const dbConnect = async () => {

    const DBURL = process.env.DBURL

    try {
        await mongoose.connect(DBURL);

        console.log("database connected successfully");
    } catch (error) {
        console.log("not connected", error);
    }
}

export default dbConnect;