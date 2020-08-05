const express = require("express")
const router = express.Router()
const { registeR, login, getUser, logout, imageUpload, forgotPassword, resetPassword, editDetails } = require("../controlers/auth")
const profileImageUpload = require("../middlewares/libraries/profileImageUpload")

const { getAccessToRoute } = require("../middlewares/authorazition/auth")

//api/auth
//api/auth/register   buraya getirecek


// router.get("/", (req, res) => {
//     res.send("Auth Home Page")
// })
router.post("/register", registeR)
router.post("/login", login)
router.get("/profile", getAccessToRoute, getUser)
router.get("/logout", getAccessToRoute, logout)
router.post("/upload", [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload)
router.post("/forgetpassword", forgotPassword)
router.put("/resetpassword", resetPassword)
router.put("/edit", getAccessToRoute, editDetails)

// router.get("/register", (req, res) => {
//     res.send("Auth register page")
// })
module.exports = router