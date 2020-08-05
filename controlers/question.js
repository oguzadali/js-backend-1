
const Question = require("../models/Question")
const CustomError = require("../helpers/errors/CustomError")
const asyncErrorWrapper = require("express-async-handler")

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
    const information = req.body
    const question = await Question.create({
        ...information,
        user: req.user.id
    })
    res
        .status(200).json({
            success: true,
            data: question
        })
})

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {

    return res.status(200)
        .json(res.queryResults)
})
const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {


    return res.status(200)
        .json(res.queryResults)
})

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const { title, content } = req.body
    let question = await Question.findById(id)
    question.title = title
    question.content = content
    question = await question.save()

    return res.status(200)
        .json({
            success: true,
            data: question
        })
})
const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    await Question.findByIdAndDelete(id)
    return res.status(200)
        .json({
            success: true,
            message: "successfull"
        })
})
const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const question = await Question.findById(id)
    if (question.likes.includes(req.user.id)) {
        return next(new CustomError("you liked", 400))
    } question.likes.push(req.user.id)
    question.likeCount = question.likes.length
    await question.save()
    return res.status(200)
        .json({
            success: true,
            message: "liked"
        })
})
const undolikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params
    const question = await Question.findById(id)
    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError("you can't", 400))
    }
    const index = question.likes.indexOf(req.user.id)
    question.likes.splice(index, 1)
    question.likeCount = question.likes.length
    await question.save()
    return res.status(200)
        .json({
            success: true,
            message: "liked"
        })
})


module.exports = { askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undolikeQuestion }






