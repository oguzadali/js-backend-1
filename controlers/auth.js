
const User = require("../models/user")
const customErrorHandler = require("../middlewares/errors/customerrorhandler")
const CustomError = require("../helpers/errors/CustomError")
const asyncErrorWrapper = require("express-async-handler")
const { sendJwtClient } = require("../helpers/authorization/tokenhelpers")
const { validateUserInput, comparePassword } = require("../helpers/authorization/inputhelpers")
const user = require("../models/user")
const sendEmail = require("../helpers/libraries/sendemail")
const registeR = asyncErrorWrapper(async (req, res, next) => {
    //post data
    // const name = "user2"
    // const email = "zzwzdffgfz@gmail.com"
    // const password = "1f1fghfghfghfghh"

    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendJwtClient(user, res)

})
const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body
    if (!validateUserInput(email, password)) {
        return next(new CustomError("please check inputs", 400))
    }
    const user = await User.findOne({ email }).select("+password")

    if (!comparePassword(password, user.password)) {
        return next(new CustomError("password incorrect", 400))
    }

    sendJwtClient(user, res)

})

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env
    return res.status(200)
        .cookie({
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: NODE_ENV === "development" ? false : true
        }).json({
            success: true,
            message: "Logout successful"
        })


})

const getUser = asyncErrorWrapper(async (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
})

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    })
    res.status(200)
        .json({
            success: true,
            message: "Upload Successful",
            data: users
        })

})
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email
    const user = await User.findOne({ email: resetEmail })
    if (!user) {
        return next(new CustomError("no user", 400))
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser()
    await user.save()

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`
    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a>Will expire in 1 hour</p>
    `;

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "reset your password",
            html: emailTemplate
        })
        return res.status(200).json({
            success: true,
            message: "token sent to your mail"
        })
    }
    catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return next(new CustomError("email coldn't be sent"), 500)
    }
})
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query
    const { password } = req.body
    if (!resetPasswordToken) {
        return next(new CustomError("Please provide a valid token", 400))
    }
    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }

    })
    if (!user) {
        return next(new CustomError("Invalid token or session expired", 400))
    }
    user.password = password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined
    await user.save()

    return res.status(200)
        .json({
            success: true,
            message: "Reset password process successful"
        })

})

const editDetails = asyncErrorWrapper(async (req, res, next) => {
    const editInformation = req.body
    const user = await User.findByIdAndUpdate(req, res, id, editInformation, {
        new: true,
        runValidators: true
    })
    return res.status(200)
        .json({
            success: true,
            message: "Reset password process successful"
        })

})


module.exports = {
    registeR,
    login,
    getUser,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
}