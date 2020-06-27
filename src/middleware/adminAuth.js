const jwt = require('jsonwebtoken')
const  Admin = require('../database/models/adminModal')
const auth = require('./auth')


const adminAuth =async function(req,res,next){

    try{
        if(!req.cookies.token) console.log('nope')
        const _id =  jwt.verify(req.cookies.token,process.env.JWT_SECRET)._id
        const admin =   await Admin.findById({_id})
        if(!admin) throw new Error("NO user fouond")
        req.user = admin
        req.authentication ='loggedin'
        next()
    }catch(e){
        console.log(e.message)
        req.authentication = 'loggedout'
        res.send({authentication:req.authentication,message:'unsuccessful',error:e.message})
    }

}   

module.exports = adminAuth