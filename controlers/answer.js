const Question = require("../models/Question")
const CustomError = require("../helpers/errors/CustomError")
const asyncErrorWrapper = require("express-async-handler")
const Answer = require("../models/Answer")
const question = require("./question")


const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params
    const user_id = req.user.id;
    const information = req.body

    const answer = await Answer.create({
        ...information,
        question: question_id,
        user: user_id
    })
    return res.status(200)
        .json({
            success: true,
            data: answer
        })
})

const getAllAnswersByQuestions = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params
    const question = await Question.findById(question_id).populate("answers")//get all things of answers
    const answers = question.answers

    return res.status(200)
        .json({
            success: true,
            count: answers.length,
            data: answers
        })
})

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const answer = await Answer.findById(answer_id)
        .populate({
            path: "question",
            select: "title"
        })
        .populate({
            path: "user",
            select: "name profile_image"
        })  //get all things of answers


    res.status(200)
        .json({
            success: true,
            data: answer
        })
})




const editAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const { content } = req.body

    let answer = await Answer.findById(answer_id)
    answer.content = content
    await answer.save()

    res.status(200)
        .json({
            success: true,
            data: answer
        })
})
const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params

    await Answer.findByIdAndDelete(answer_id)
    question.answerCount = question.answers.length
    return res.status(200)
        .json({
            success: true,
            message: "successfull"
        })
})

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const answer = await Answer.findById(answer_id)
    if (answer.likes.includes(req.user.id)) {
        return next(new CustomError("you liked answer", 400))
    } answer.likes.push(req.user.id)
    await answer.save()
    return res.status(200)
        .json({
            success: true,
            date: answer,
            message: "liked"
        })
})
const undolikeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answer_id } = req.params
    const answer = await Answer.findById(answer_id)
    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomError("you can't", 400))
    }
    const index = answer.likes.indexOf(req.user.id)
    answer.likes.splice(index, 1)
    await answer.save()
    return res.status(200)
        .json({
            success: true,
            message: "undo_liked"
        })
})





module.exports = {
    addNewAnswerToQuestion,
    getAllAnswersByQuestions,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undolikeAnswer
}