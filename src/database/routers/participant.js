const express = require('express')
const jwt = require('jsonwebtoken')
// const sendMail = require('../../emails/welcome')
const app = express()
const auth = require('../../middleware/auth')
const adminAuth = require('../../middleware/adminAuth')
const router =  new express.Router()
const User = require('../models/usersmodel')
const Matches = require('../models/matchesModel')
const Participant = require('../models/participantModel')

// router.post('/team/details/:id',adminAuth,async(req,res)=>{
    
//     try{
//         const  team =await Participant.findById({_id : req.params.id})
//         res.send(team)
//     }catch(e){
//         res.send({error : e.message})
//     }
// })

// router.post('/user/team/:id',auth,async(req,res)=>{
//     try{
//         const team = await Participant.findById({_id : req.params.id})
//         res.send(team)
//     }catch(e){
//         res.send({error : e.message})
//     }
// })


router.get('/team/:id',async(req,res)=>{
    try{
        const team = await  Participant.findById({_id:req.params.id})
        res.send(team)
    } catch (e){
        res.send({error:e.message})
    }
})

router.post('/team/reg',async(req,res)=>{
    try{
        console.log(req.body)
        const  team =new Participant(req.body)
        const match = await Matches.findById(req.body.match_id)
        console.log(team._id)
        match.teams = match.teams.concat({team_id : team._id})
        await match.save()
        await team.save()
        res.send({message:'successful',error:''})
    }catch(e){
        res.send({error : e.message})

    }
})
router.patch('/team/:id',async(req,res)=>{
    try{
        const  team =await Participant.findByIdAndUpdate({_id : req.params.id},req.body)
        res.send(team)
    }catch(e){
        res.send({error : e.message})
    }
})
router.delete('/team/:id',async(req,res)=>{
    try{
        const  team =await Participant.findByIdAndRemove({_id : req.params.id})
        res.send(team)
    }catch(e){
        res.send({error : e.message})
    }
})




//deleting team from admin router
router.post('/team/delete',adminAuth,async(req,res)=>{

    try{
        const match = await Matches.findById(req.body.match_id)
        match.teams = match.teams.filter((x)=> x.team_id!== req.body.id)
        match.save()
        const team = await Participant.findByIdAndRemove({_id : req.body.id})

        res.redirect('/admin/match/status/'+req.body.match_id)
    }catch(e){
        res.send({error : e.message})
    }
})

module.exports = router