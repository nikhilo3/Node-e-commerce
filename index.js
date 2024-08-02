import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./config/dbconnect.js";
import userrouter from "./routers/userRoute.js";
import cookieParser from "cookie-parser";
import productRouter from "./routers/productRoute.js";
import morgan from "morgan";
import blogRouter from "./routers/blogRoute.js";
import categoryRouter from "./routers/categoryRoute.js";
import blogCatRouter from "./routers/blogCatRoute.js";
import brandRouter from "./routers/brandRoute.js";
import couponRouter from "./routers/couponRoute.js";
// import { errorhandler, notFound } from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//connect mongodb atlas database
dbConnect();

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//routers
app.use('/api/user', userrouter);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/category',categoryRouter);
app.use('/api/blogcategory',blogCatRouter);
app.use('/api/brand',brandRouter);
app.use('/api/coupon',couponRouter);



//error handler  use error handle to only on express-async-handler npm
// app.use(notFound);
// app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT}`);
});