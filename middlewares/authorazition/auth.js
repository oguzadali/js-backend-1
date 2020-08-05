const CustomError = require("../../helpers/errors/CustomError")
const jwt = require("jsonwebtoken")
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenhelpers")
const User = require("../../models/user")
const asyncErrorWrapper = require("express-async-handler")
const Question = require("../../models/Question")
const Answer = require("../../models/Answer")
const getAccessToRoute = (req, res, next) => {

    const { JWT_SECRET_KEY } = process.env
    if (!isTokenIncluded(req)) {
        //401 -unauthorized --you are  not logged
        //403 -forbidden   --you are logged in but you are not authorized to process
        return next(new CustomError("**You are not authorized to acess this route", 403))
    }
    const accessToken = getAccessTokenFromHeader(req)
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("You are not authorized to access this route 1", 401))
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next()
    })
}
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user
    const user = await User.findById(id)
    if (user.role !== "admin") {
        return next(new CustomError("only admin!!", 403))
    }
    next()
})

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id
    const questionId = req.params.id

    const question = await Question.findById(questionId)

    if (Question.user != userId) {
        return next(new CustomError("it's not your post ,you can't change", 403))
    }
    next()
})
const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id
    const answerId = req.params.answer_id

    const answer = await Answer.findById(answerId)

    if (answer.user != userId) {
        return next(new CustomError("it's not your post ,you can't change", 403))
    }
    next()
})

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}