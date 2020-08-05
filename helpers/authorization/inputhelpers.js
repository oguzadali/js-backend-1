
const bcrypt = require("bcryptjs")

const validateUserInput = (email, password) => {
    return email && password
    //herhangi biri yoksa false döndürür
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    validateUserInput,
    comparePassword


}