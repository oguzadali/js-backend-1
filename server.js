const express = require("express")
const app = express()
const dotenv = require("dotenv")
const routers = require("./routers/index")
const db = require("./helpers/database/connect2db")
const connectDatabase = require("./helpers/database/connect2db")
const customErrorHandler = require("./middlewares/errors/customerrorhandler")
const path = require("path") //library for path operations


//environment variables
dotenv.config({
    path: "./config/env/config.env"
})
const PORT = process.env.PORT

//express-body middleware
app.use(express.json()) //postla gelen verileri json olarak algılamasını sağladı


app.use("/api", routers)

//db connection
connectDatabase()

//static files
// console.log(__dirname)
//we showed the location of the static files
app.use(express.static(path.join(__dirname, "public")))


app.use(customErrorHandler)

app.listen(PORT, () => {
    console.log(`app started on ${PORT} : ${process.env.NODE_ENV}`)
})


