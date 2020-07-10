const express = require('express')
const jwt = require('jsonwebtoken')
// const Razorpay = require('razorpay')
// const sendMail = require('../../emails/welcome')
const app = express()
const auth = require('../../middleware/auth')
const router =  new express.Router()
const adminAuth = require('../../middleware/adminAuth')
const User = require('../models/usersmodel')
const Matches = require('../models/matchesModel')
const Participant = require('../models/participantModel')
const Admin = require('../models/adminModal')





router.post('/admin/login',async(req,res)=>{
    try{
        const user = await Admin.findByCresidential(req.body.email,req.body.password)
        const token = await user.genAuthToken()
        res.cookie('token',token,{maxAge:604800000})
        app.use(adminAuth)
        res.send({user,error:'',message:'successful',authentication:req.authentication})
    }catch(e){
        res.send({error:e.message,message:'unsucessful'})
    }
})
 
router.get('/admin/me',adminAuth,(req,res)=>{
    res.send({user: req.user,message:'successful',authentication:req.authentication})
})



// router.get('/admin/match/:id',async(req,res)=>{
//     const _id = req.params.id.toString()
//     console.log(_id)
//     try{
//         if(!_id) throw new Error('Plesase provie id')
//         match = await Matches.findById(_id)
//         res.send({match})
        
//     }catch(e){
//         res.send({error:e.message})
//     }
// })


// router.get('/team/details/:id',adminAuth,(req,res)=>{
//     res.render('admin/team.hbs',{title :"Team Details"})
// })
// router.get('/team/delete/:id',adminAuth,(req,res)=>{
//     res.render('admin/team_delete',{title :"Delete Team"})
// })

// router.get('/matches/teams/contact/:id',adminAuth,async(req,res)=>{
//     res.render('admin/contact',{title :"Contact Numbers"})
// })

// router.post('/admin/team/update',adminAuth,async(req,res)=>{
//     try{
//         const team = await Participant.findById({_id : req.body.id})
//         const up = await Participant.findByIdAndUpdate(req.body.id ,req.body)
//         res.redirect('/admin/matches')
//     }catch(e){
//         res.send({error : e.message})
//     }
// })
// router.get('/admin/payments',adminAuth,async(req,res)=>{
//     var instance = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_SECRET_KEY
//       })
//     const id = await instance.orders.all()
//       res.send(id)
// })
// router.post('/admin/signup',async(req,res)=>{

//     try{
//         console.log(req.body)
//         const admin =  new Admin(req.body)
//         await admin.save()
//         res.send(admin)
//     }catch(e){
//         console.log('error')
//         if(e.message.includes('dup key')) res.send({error: "Email is already registered",message:unsuccessful})
//         res.send(e.message)
//     }
// })

module.exports = router
