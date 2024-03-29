const express = require('express')
const jwt = require('jsonwebtoken')
// const sendMail = require('../../emails/welcome')
const app = express()
const userAuth = require('../../middleware/auth')
const adminAuth = require('../../middleware/adminAuth')
const router =  new express.Router()
const User = require('../models/usersmodel')
const Matches = require('../models/matchesModel')
const Participant = require('../models/participantModel')
const Match = require('../models/matchesModel')

//FOR EVERYONE
router.get('/matches',async(req,res)=>{
    const nowtime = new Date()
    const matches =await Matches.find({ time:{$gte:nowtime} }).sort({_id : -1}).limit(10)
    res.send(matches)
})
router.get('/next-match',async(req,res)=>{
    const nowtime  = new Date()
    var match  = await Match.findOne({ $or: [{ match_status: 1 }, {  match_status: 2  }],time:{$gte:nowtime} }).sort({time:1})
    const publicMatch = match.toObject()
    delete publicMatch.room_id
    delete publicMatch.room_password
    res.send(publicMatch) 
})
router.get('/live-match',async(req,res)=>{
    var match  = await Match.findOne({ match_status: 3}).sort({time:-1})
    const publicMatch = match.toObject()
    delete publicMatch.room_id
    delete publicMatch.room_password
    res.send(publicMatch)
})

router.get('/admin/matches',adminAuth,async(req,res)=>{
    const matches = await Matches.find({}).sort({_id : -1}).limit(15)
    res.send({message:'successful',error:'',matches})
})
router.get('/admin/match/:id',adminAuth,async (req,res)=>{
    try{
        const match = await Matches.findById(req.params.id)
        res.send({message:'successful',error:'',match})
        
    }catch(e){
        res.send({error:e.message})
    }

})
router.post('/user/match-details',userAuth,async(req,res)=>{
    try{
        console.log(req.body)
        const match_id = req.body._id
        const match = await Match.findById(match_id)
        if(!match) throw new Error('No Such Match Found')
        let userMatched = false
        const teams = match.teams.map(async(team)=>{
            const singleTeam = await Participant.findById(team.team_id)
            if(singleTeam.user_id.toString()===req.user._id.toString()) {
                return userMatched = true
            } 
        })
        await Promise.all(teams)
        if(userMatched===true){
            res.send({error:'',match})
        }else{
            res.send({error:'You are not registered to this match'})
        }
        
    } catch(e){
        res.send({error:e.message})
    }   
})
router.patch('/admin/match/:id',adminAuth,async(req,res)=>{

    try{
        match = await Matches.findOneAndUpdate({_id:req.params.id},req.body)
        if(!match) throw new Error('Match not found')
        res.send({error:'',message:'successful',match})
        
    }catch(e){
        res.send({message:'unsuccessful',error:e.message})
    }
    
})
router.delete('/admin/match/:id',adminAuth,async(req,res)=>{

    try{
        const match =await Matches.findById({_id:req.params.id})
        if(!match) throw new Error('Match not found.')
        match.teams.forEach(async(x)=>{
            const team = await Participant.findOneAndRemove({_id : x.team_id})
        })
        await Matches.findOneAndDelete({_id:req.params.id})
        res.send({error:'',message:'successful',match})
        
    }catch(e){
        res.send({message:'unsuccessful',error:e.message})
    }
    
})


// //Only for upcoming matches  ? registration= Opne && closed ! Finished
router.get('/matches/home',async(req,res)=>{
    var matches =await Matches.find({ $or: [{ status: 1 }, {  status: 2  }] }).sort({_id : -1}).limit(10)
    const match = matches.map(function(x){
        const user = x.toObject()
        delete user.teams
        delete user.__v
        return user
    })
    res.send(match)
})

// //FOR ADMIN
// router.get('/matches/teams/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const match =await Matches.findById({_id : _id})
//         const teams =await match.teams.map(async(team)=>{
//             const Team = await Participant.findById({_id : team.team_id})
//             const publicProfile  = Team.publicProfile()
//             return Team
//         })
//         const publicTeam =await Promise.all(teams)
//         res.send({publicTeam,match})

//     } catch(e){
//         res.send(e.message)
//     }
// })
// //FOR GETTNG CONTACT ID  OF ALL THE PARTICAPTNT
// router.post('/matches/teams/contact/:id',adminAuth,async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const match =await Matches.findById({_id : _id})
//         const teams =await match.teams.map(async(team)=>{
//             const Team = await Participant.findById({_id : team.team_id})
//             const tm = {
//                 team_name : Team.team_name,
//                 contact_no : Team.contact_no
//             }
//             return tm
//         })
//         const publicTeam =await Promise.all(teams)
//         console.log(publicTeam)
//         res.send({publicTeam,match})

//     } catch(e){
//         res.send(e.message)
//     }
// })
// //FOR USER  TEAM AND THIER ID
router.get('/admin/match/teams/:id',adminAuth,async(req,res)=>{
    try{
        const match = await Matches.findById({_id : req.params.id})
        const teams = await match.teams.map(async(team)=>{
            const Team = await Participant.findById({_id : team.team_id})
            return Team
        })
        const publicTeam =await Promise.all(teams)
        res.send({teams:publicTeam,match})

    } catch(e){
        res.send(e.message)
    }
})
router.post('/matche/teams',adminAuth,async(req,res)=>{
    const _id = req.params.id
    try{
        const match =await Matches.findById({_id : _id})
        const teams =await match.teams.map(async(team)=>{
            const Team = await Participant.findById({_id : team.team_id})
            const publicProfile  = Team.publicProfile()
            return Team
        })
        const publicTeam =await Promise.all(teams)
        res.send({publicTeam,match})

    } catch(e){
        res.send(e.message)
    }
})




// router.post('/matches/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const match =await Matches.find({_id})
//         res.send(match)

//     } catch (e){
//         res.send({"error":e.message})
//     }
// })




// router.post('/admin/match_update/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const match =await Matches.findById({_id})
//         res.send(match)

//     } catch (e){
//         res.send(e.message)
//     }
// })

//For updating a match

router.post('/match/create',adminAuth,async(req,res)=>{
    console.log(req.body)
    
    try{
        const match = new Matches(req.body)
        await match.save()
        res.send({error:'',message:'successful',match})
    } catch(e){
        console.log(e.message)
        res.send({error:e.message,message:'unsuccessful',authentication:req.authentication})
    }
})
router.patch('/match/update',adminAuth,async(req,res)=>{
    
    try{
        const match =await Matches.findByIdAndUpdate(req.body.match_id,req.body)
        if(!match) throw new Error('Match not found')
        res.send({message:'successful',error:''})
    }catch(e){
        res.send({message:'unsuccessful',error:e.message})
    }
})


//For deltetnin matach
router.delete('/match/delete',adminAuth,async(req,res)=>{
    const _id = req.body.match_id
    try{
        const match =await Matches.findById({_id})
        if(!match) throw new Error('Match not found.')
        match.teams.forEach(async(x)=>{
            const team = await Participant.findOneAndRemove({_id : x.team_id})
        })
        const matchdel =await Matches.findOneAndRemove({_id})
        res.send({message:'successful', error:''})

    } catch (e){
        res.send({message:'unsuccessful',error:e.message})
    }
})

module.exports = router