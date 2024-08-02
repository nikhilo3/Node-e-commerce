// use error handle to only on express-async-handler npm

//not Found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error)
}

const errorhandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    req.status(statuscode);
    res.json({
        message:err?.message,
        stack:err?.stack,
    })
}

export {notFound,errorhandler}