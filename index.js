const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
    "/api", 
    require("./routes/mangaRoutes"), 
    require("./routes/chapterRoutes"),
    require("./routes/imageRoutes"),
    require("./routes/followRoutes")
);
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});