const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
var cors = require('cors');
connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');

    // Request methods you wish to allow
    // res.setHeader('Content-Range', 'posts : 0-9/2000');

    // Pass to next layer of middleware
    next();
});
app.use(
    "/api", 
    require("./routes/mangaRoutes"), 
    require("./routes/chapterRoutes"),
    require("./routes/imageRoutes"),
    require("./routes/followRoutes"),
    require("./routes/commentRoutes"),
    require("./routes/userRoutes"),
    require("./routes/ratingRoutes")
);
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});