const jwt = require('jsonwebtoken')
const User = require('../database/models/student')

const loginAuth = async(req,res,next)=>{
    try{
        var that = req.headers.cookie
        const tip = that.split(";")
        const vx = tip.filter((x)=>{return x.includes('token=')})
        const bToken = vx[0].split("token=")[1]
        const _id = jwt.verify(bToken,process.env.JWT_SECRET)._id
        console.log(_id)
        const user = await User.findById({_id})
        req.user = user
        next()
    } catch (e) {
        const user = undefined
        req.user = user
        console.log(req.user)
        next()

    }
}

module.exports = loginAuth