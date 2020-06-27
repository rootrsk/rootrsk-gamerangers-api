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

//FOR EVERYONE
router.get('/matches',async(req,res)=>{
    const matches =await Matches.find({}).sort({_id : -1}).limit(10)
    res.send(matches)
})

// //Only for upcoming matches  ? registration= Opne && closed ! Finished
// router.get('/matches/home',async(req,res)=>{
//     var matches =await Matches.find({ $or: [{ status: 1 }, {  status: 2  }] }).sort({_id : -1}).limit(10)
//     const match = matches.map(function(x){
//         const user = x.toObject()
//         delete user.teams
//         delete user.__v
//         return user
//     })
//     res.send(match)
// })

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
// router.post('/matches/teams/:id',async(req,res)=>{
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



// router.post('/match/set',adminAuth,async(req,res)=>{
//     try{
//         const match = new Matches(req.body)
//         await match.save()
//         res.redirect('/admin/matches')

//     }catch(e){  
//         res.send(e.message)
//     }
// })

// // router.get('/matches',async(req,res)=>{
// //     const matches =await Matches.find({})   
// //     res.render('user/matches',{
// //         match : matches
// //     })
// // })


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


// router.post('/match/update',async(req,res)=>{
//     console.log(req.body)
//     const match =await Matches.findByIdAndUpdate(req.body.id,req.body)
//     res.redirect('/admin/matches')
// })
// router.post('/admin/match/delete/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const match =await Matches.findById({_id})
//         res.send(match)
//     } catch (e){
//         res.send(e.message)
//     }
// })
// router.post('/match/delete',async(req,res)=>{
//     const _id = req.body.id
//     try{
        
//         const match =await Matches.findById({_id})
//         match.teams.forEach(async(x)=>{
//             const team = await Participant.findOneAndRemove({_id : x.team_id})
//             console.log(team)
//         })
//         const matchdel =await Matches.findOneAndRemove({_id})
//         console.log(_id)
//         res.redirect('/admin/matches')
//     } catch (e){
//         res.send(e.message)
//     }
// })

module.exports = router