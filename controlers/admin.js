const user = require("../models/user")
const CustomError = require("../helpers/errors/CustomError")
const asyncErrorWrapper = require("express-async-handler")



const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    user.blocked = !user.blocked
    await user.save()
    return res.status(200)
        .json({
            success: true,
            message: "blocked"
        })
})


const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    await user.remove()
    return res.status(200)
        .json({
            success: true,
            message: "delete success"
        })

})


module.exports = {
    blockUser,
    deleteUser
}
