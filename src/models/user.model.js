import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9_]+$/, "Invalid username"],
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    avatar: {
        type: String,
        default : ""
    },

    refreshToken: {
        type: String
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be atleast 8 characters"],
        select: false
    }

}, { timestamps: true })


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.isPasswordCorrect = async function (password) {
    console.log("thispassword is ", this.password)
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken =  function () {
    return jwt.sign(
        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User", userSchema)