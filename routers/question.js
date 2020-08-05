const express = require("express")
const { askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undolikeQuestion } = require("../controlers/question")
const { getAccessToRoute, getQuestionOwnerAccess } = require("../middlewares/authorazition/auth")
const { checkQuestionExist } = require("../middlewares/database/databaseErrorHelpers")
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleWare")
const answerQueryMiddleware = require("../middlewares/query/answerQueryiddleware")
const answer = require("./answer")
const Question = require("../models/Question")

const router = express.Router()


router.get("/", questionQueryMiddleware(Question, { population: { path: "user", select: "name profile_image" } }), getAllQuestions)
router.get("/:id", checkQuestionExist, answerQueryMiddleware(Question, { population: [{ path: "user", select: "name profile_image" }, { path: "answers", select: "content" }] }), getSingleQuestion)
router.post("/ask", getAccessToRoute, askNewQuestion)
router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion)
router.delete("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion)
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion)
router.get("/:id/undolike", [getAccessToRoute, checkQuestionExist], undolikeQuestion)

router.use("/:question_id/answers", checkQuestionExist, answer)

module.exports = router




