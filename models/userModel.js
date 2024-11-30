const {Schema, model} = require("mongoose");
const { error } = require("node:console");
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require("../service/auth");

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/image/user-avatar-male-5.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
}, { timestamps: true }
)

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedpassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedpassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken",async function(email, password){
    const user = await this.findOne({ email });
    if(!user) throw new Error("user not found");

    const salt = user.salt;
    const HashPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex"); 

    if(HashPassword !== userProvidedHash) throw new Error("incorrect password");

    const token = createTokenForUser(user);
    return token;
})

const user = model("user", userSchema);

module.exports = user;