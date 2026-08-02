import asyncHandler from "../utilities/asyncHandler.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utilities/cloudinary.js"
import jwt from "jsonwebtoken"


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access Tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    if (
        [email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.file?.path

    const avatar = await uploadOnCloudinary(avatarLocalPath)


    try {
        const user = await User.create({
            email: email.trim().toLowerCase(),
            username: username.trim().toLowerCase(),
            password,
            avatar: avatar?.url
        })

        const createdUser = await User.findById(user._id).select("-refreshToken");

        return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"))

    } catch (error) {

        //database failed so remove the uploaded file
        if (avatar?.url) {
            await deleteFromCloudinary(avatar.url)
        }

        throw new ApiError(500, "Something went wrong while registering the user")
    }

})


const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body

    if (!email && !username) {
        throw new ApiError(400, "Email or Username required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    }).select("+password")

    if (!user) {
        throw new ApiError(400, "Invalid credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid  credentials")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)


    const loggedInUser = await User.findById(user._id).select("-refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "User logged In successfully"))

})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }


        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: refreshToken }, "Access token refreshed"))


    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid refresh token")
    }

})


const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different")
    }

    const user = await User.findById(req.user?._id).select("+password")

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword
    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))

})


const updateProfile = asyncHandler(async (req, res) => {
    const { username, email } = req.body

    if (!username || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUsername = username.trim().toLowerCase()

    const existedUser = await User.findOne({
        $or: [{ email : normalizedEmail }, { username : normalizedUsername}],
        _id: { $ne: req.user._id }
    })

    if(existedUser){
        throw new ApiError(400, "Email or username already exists")
    }


    const updatedProfile = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                username: normalizedUsername,
                email: normalizedEmail
            }
        },
        {
            new: true
        }
    ).select("-refreshToken")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProfile, "Update user profile successfully"))

})


const updateAvatar = asyncHandler(async (req, res) => {
    const newAvatarLocalPath = req.file?.path

    if (!newAvatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const newAvatar = await uploadOnCloudinary(newAvatarLocalPath)

    if (!newAvatar?.url) {
        throw new ApiError(500, "Error while uploading new avatar")
    }

    const oldAvatarUrl = (await User.findById(req.user?._id))?.avatar

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: newAvatar.url || ""
            }
        },
        {
            new: true
        }
    ).select("-refreshToken")


    //delete old avatar:
    await deleteFromCloudinary(oldAvatarUrl)


    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))

})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Fetched user profile successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateProfile,
    updateAvatar,
    getCurrentUser
}