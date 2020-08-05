var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const Question = require("../models/Question")
var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"] //zorunlu alan
    },
    email: {
        type: String,
        required: [true, "Please try different e-mail"],
        unique: [true, "Please try different"],//1 mail sadece 1 kere kullanılır
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide email"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    password: {
        type: String,
        minlength: [6, "min 6 character"],
        required: [true, "Please provide a password"],
        select: false
    },
    createdDt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
    },
    about: {
        type: String
    },
    profileİmage: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }

});

UserSchema.methods.getResetPasswordTokenFromUser = function () {
    const randomHexString = crypto.randomBytes(15).toString("hex")
    const { RESET_PASSWORD_EXPIRE } = process.env
    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex")

    this.resetPasswordToken = resetPasswordToken
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE)


    return resetPasswordToken
}

//userschema methods
UserSchema.methods.generateJwtFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env

    const payload = {
        id: this._id,
        name: this.name
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })
    return token
}
//pre ,userchema dan hemen önce anlamına geliyo
UserSchema.pre("save", function (next) {
    //parola değişme
    if (!this.isModified("password")) {
        next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err)
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err)
            this.password = hash;
            next()
            // Store hash in your password DB.
        })
    });
})
UserSchema.post("remove", async function () {
    await Question.deleteMany({
        user: this._id
    })
})

module.exports = mongoose.model("User", UserSchema)


