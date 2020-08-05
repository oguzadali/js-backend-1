const mongoose = require("mongoose")
const slugify = require("slugify")
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: [true, "please provide a title"],
        minlength: [10, "Please provide title at least 10 characters"],
        unique: true  //this title will only be used once
    },
    content: {
        type: String,
        required: [true, "please provide a title"],
        minlength: [10, "Please provide title at least 20 characters"],
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,//user ıd added
        ref: "User" //we can call user through this referance
    },
    likeCount: {
        type: Number,
        default: 0
    },

    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    answerCount: {
        type: Number,
        default: 0
    },
    answers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Answer"
        }
    ]

})
QuestionSchema.pre("save", function (next) {
    if (!this.isModified("title")) {
        next()
    }
    this.slug = this.makeSlug()
    next()


})
QuestionSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi'       // language code of the locale to use
    })
}


module.exports = mongoose.model("Question", QuestionSchema)



