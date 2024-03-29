const jwt = require('jsonwebtoken')
const User = require('../database/models/usersmodel')

const auth = async(req,res,next)=>{
    try{
        const _id = jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id
        const user = await User.findById({_id})
        if(!user) throw new Error("NO user")
        req.user = user
        next()
    } catch (e) {
        const user = undefined
        req.user = user
        console.log(req.user)
        next()
    }
}

module.exports = auth