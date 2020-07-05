const jwt = require('jsonwebtoken')
const User = require('../database/models/usersmodel')

const auth = async(req,res,next)=>{
    try{
        const _id = jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id
        console.log(_id)
        const user = await User.findById({_id})
        if(!user) throw new Error("No user found")
        req.user = user
        req.authentication ='loggedin'
        next()
    } catch (e) {
        req.authentication = 'loggedout'
        res.clearCookie('token')
        console.log("user not found")
        res.send({authentication :req.authentication,message:'unsuccessful'})
        // next()
    }
}

module.exports = auth