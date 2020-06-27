const jwt = require('jsonwebtoken')


const genAuthToken = async function(id){
    const token  =await jwt.sign({_id : id.toString()},process.env.JWT_SECRET)
    return token
}

module.exports = genAuthToken