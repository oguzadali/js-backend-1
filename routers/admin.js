const express = require("express")
const router = express.Router()
const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorazition/auth")
const { route } = require("./question")
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers")
const { blockUser, deleteUser } = require("../controlers/admin")


router.use([getAccessToRoute, getAdminAccess])



//block user

router.get("/block/:id", checkUserExist, blockUser)
router.delete("/user/:id", checkUserExist, blockUser)
//delete user


module.exports = router