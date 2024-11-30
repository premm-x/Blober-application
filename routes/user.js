const { Router } = require("express");
const userModel = require("../models/userModel");

const router = Router();

router.get("/signup", (req, res) =>{
    res.render("signup");
})

router.get("/signin", (req, res) =>{
    res.render("signin");
})

router.get("/logout", (req, res) =>{
    res.clearCookie("token").redirect("/");
})

router.post("/signin",async (req, res) =>{
    const { email, password } = req.body;
    
    try {
        const token = await userModel.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Invalid email or password",
        });
    }
})

router.post("/signup",async (req, res) =>{
    const {fullname, email, password} = req.body;

    const duplicate = await userModel.findOne({ email });

    if(duplicate) return res.render("signup", {
        demail: `Email is already register : ${email}`,
    });

    const user = await userModel.create({
        fullname,
        email,
        password
    })

    await user.save();

    return res.render("signup", {
        success: "successfully Register..!",
    });
})


module.exports = router;
