const jwt = require('jsonwebtoken')
const User = require('../database/models/usersmodel')

const auth = async(req,res,next)=>{
    try{
        if(!req.cookies.token) throw new Error('You are not logged in or cookie setting is closed')
        const _id = jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id
        const user = await User.findById({_id})
        console.log(user._id)
        if(!user) throw new Error("No user found")
        req.user = user
        req.authentication ='loggedin'
        next()
    } catch (e) {
        req.authentication = 'loggedout'
        res.clearCookie('token')
        res.removeHeader('token')
        console.log("user not found")
        res.send({authentication :req.authentication,message:'unsuccessful',error:e.message})
        // next()
    }
}

module.exports = auth