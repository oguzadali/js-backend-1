const express = require("express")
const router = express.Router()
const { getSingleUser, getAllUsers } = require("../controlers/user.js")
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers")
const User = require("../models/user")

const { userQueryMiddleware } = require("../middlewares/query/userQueryMiddleWare")
router.get("/", userQueryMiddleware(User), getAllUsers)
router.get("/:id", checkUserExist, getSingleUser)
module.exports = router