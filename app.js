require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const blogModel = require("./models/blogModel");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { validateAuthenticationCookies } = require("./middleware/authmiddle");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
}).then(() =>{
    console.log("mongodb was connected");
})

app.set("view engine", "ejs");

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());
app.use(validateAuthenticationCookies("token"));
app.use(express.static("public"));


app.get("/",async (req, res) =>{
    const allBlog = await blogModel.find({}).populate("createdBy");
    res.render("home", {
        user : req.user,
        blogs: allBlog,
    });
})

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
