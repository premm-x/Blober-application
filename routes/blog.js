const { Router } = require("express");
const multer = require("multer");
const blogModel = require("../models/blogModel");
const commentModel = require("../models/commentModel");


const router = Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, `./public/uploads`)
    },
    filename: function(req, file, cb){
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
})

const upload = multer({storage : storage});

router.get("/addnew", (req, res) =>{
    res.render("addblog", {
        user : req.user
    });
})

router.get("/:id",async (req, res) =>{
    const blog = await blogModel.findById(req.params.id).populate("createdBy");
    const comments = await commentModel.find({ blogid: req.params.id }).populate("createdBy");

    res.render("readBlog", {
        user: req.user,
        blog,
        comments,
    })
});

router.post("/comment/:blogid",async (req, res) =>{
    await commentModel.create({
        content: req.body.content,
        blogid: req.params.blogid,
        createdBy: req.user._id,
    })

    return res.redirect(`/blog/${req.params.blogid}`);
})

router.post("/",upload.single("CoverImage"),async (req, res) =>{
    const { title, body } = req.body;   

    await blogModel.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })

    res.redirect("/");
})


module.exports = router;