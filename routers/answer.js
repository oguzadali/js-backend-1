const express = require("express")
const router = express.Router({ mergeParams: true })
const { getAccessToRoute, getAnswerOwnerAccess } = require("../middlewares/authorazition/auth")
const { checkQuestionAndAnswerExist } = require("../middlewares/database/databaseErrorHelpers")
const { addNewAnswerToQuestion, getAllAnswersByQuestions, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, undolikeAnswer } = require("../controlers/answer")
// const { route } = require("./question")

router.post("/", getAccessToRoute, addNewAnswerToQuestion)

router.get("/", getAllAnswersByQuestions)
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswer)
router.get("/:answer_id/like", [checkQuestionAndAnswerExist, getAccessToRoute], likeAnswer)
router.get("/:answer_id/undo_like", [checkQuestionAndAnswerExist, getAccessToRoute], undolikeAnswer)
router.put("/:answer_id/edit", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer)
router.delete("/:answer_id/delete", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer)



module.exports = router

