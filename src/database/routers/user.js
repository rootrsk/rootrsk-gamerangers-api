const express = require('express')
const jwt = require('jsonwebtoken')
// const sendMail = require('../../emails/welcome')
const app = express()
const auth = require('../../middleware/auth')
const userAuth = require('../../middleware/checkUserAuth')
const router =  new express.Router()
const User = require('../models/usersmodel')
const Matches = require('../models/matchesModel')
const Participant = require('../models/participantModel')
const { findById, findByIdAndUpdate } = require('../models/usersmodel')
router.get('/users',async(req,res)=>{
    
    const users = await User.find({})

    res.send(users) 
})

router.post('/user/login',async(req,res)=>{
    try{
        const user = await User.findByCresidential(req.body.email,req.body.password)
        const token = await user.genAuthToken()
        console.log(req.header)
        res.header('token',token)
        res.cookie('token',token,{maxAge:604800000})
        
        res.send({authentication:'loggedin',message:'successful',user:user})
    }catch(e) {
        res.send({error : e.message})   
    }
})
// router.post('/user/team',auth,async(req,res)=>{
//     console.log('coming')
//     try{
//         switch(req.body.team_type){
//             case 'solo' :
//                 console.log('solo')
//                 return
//             case 'duo' :
//                 console.log('solo')
//                 return
//             case 'squad':
//                 console.log('squading')
//                 return(
//                     async()=>{
//                         if(req.user.squad_team){
//                             const team = await Participant.findByIdAndUpdate({_id:req.user.squad_team},req.body)
//                             if(!team){
//                                 req.user.squad_team = ''
//                                 await req.user.save()
//                                 return new Error('Team Not found')
//                             }
//                             await team.save()
//                             console.log('updated')
//                             return res.send({message:'successful',instance:'updated'})
//                         } else {
//                             const team  =  new Participant(req.body)
//                             req.user.squad_team = team._id
//                             await req.user.save()
//                             await team.save()
//                             return res.send({message:'successful',instance:'created'})
//                         }
//                     }
//                 )()
//             default :
//             console.log('defaluat')
//             return res.send('something weing')
    
//         }

//     } catch (e){
//         res.send({error:e.message})
//     }
    
// })

router.get('/user/logout',auth,(req,res)=>{
    try{
        res.clearCookie('token')
        res.send({message:'successful',authentication:'loggedout'})
    } catch(e){
        res.send({message:'unsuccessful',error:e.message,authentication:req.authentication})
    }
})

router.get('/user/me',auth,async(req,res)=>{
    try{
        res.send({authentication : req.authentication,message:'successful',error:'',user: req.user})
    }catch(e){
        res.send({authentication:req.authentication,message:'unsuccessful',error:e.message})
    } 
}) 

router.get('/user/matches',auth,async(req,res)=>{
   try{
       const match = await Participant.find({user_id:req.user._id})
       res.send(match)
       
   }catch(e){
       res.send(e.message)
   }

})

// router.post('/user/team',auth,async(req,res)=>{

// })

// router.patch('/user/team',auth,async(req,res)=>{

// })


router.post('/user/signup',async(req,res)=>{
    try{
        console.log(req.body)
        const user = new User(req.body)
        await user.save()
        token =await user.genAuthToken()
        res.cookie('token',token,{maxAge:604800000})
        res.send({message:'successful'})
    }catch(e){
        if(e.message.includes('E11000 duplicate key error collection') && e.message.includes('email')){
            return res.send({error:'Email is already registered'})
        }
        res.send({error : e.message})
    }
})

router.patch('/user/profile',auth,async(req,res)=>{
    try{
        const body = req.body
        console.log(body)
        const user = await User.findByIdAndUpdate({_id:req.user._id},req.body)
        res.send({message:'successful'})
    }catch(e){
        if(e.message.includes('E11000 duplicate key error collection') && e.message.includes('email')){
            return res.send({error:'Email is already registered'})
        }
        res.send({error : e.message})
    }

})


router.get('/teams',async(req,res)=>{
    const teams = await Participant.find({})
    res.send(teams)
})
router.get('/users',async(req,res)=>{
    const teams = await User.find({})
    res.send(teams)
})

// router.get('/user/matchRegistation/:id',auth,async(req,res)=>{
//     try{ 
//         const match =await Matches.findById({_id : req.params.id})
//         if(!match) throw new Error("This match Doenst exist")
//         res.render('user/matchRegistation')
//     }catch(e){
//         res.send("<p>This match does not exist please select another<p><a><a href=\"/user/matches\">select another</a>")
//     }
// })

router.post('/user/matchRegistation',auth,async(req,res)=>{
    try{
        const match_id = req.body.match_id
        const user_id = req.user._id.toString()

        const match =await Matches.findById({_id : match_id})
        const fee = match.entry_fee

        if(match.teams.length>=16) throw new Error('Match is full please try another match')
        if(match.match_status !== 1){
            throw new Error("Registation is Closed for this match,try another ")
        } 
        const teams =  match.teams.map((x)=>{
            return x.team_id
        })

        const team_id = teams.map(async(x)=>{
            const tm = await Participant.findById(x)
            if(tm.user_id===user_id){
                throw new Error("You are already registered to this match")
            } 
            return tm.user_id
        })
        await Promise.all(team_id)

        const participant = new Participant(req.body)
        participant.match_id = match_id
        participant.user_id = user_id
        if(fee === 0){
            participant.payment_status = 4
        } else {
            participant.payment_status = 1
        }
        match.teams = match.teams.concat({team_id : participant._id})
        await participant.save()
        await match.save()
        res.send({message : 'successful',error:'' ,team:  participant })

    }catch(e){
        res.send({error : e.message,message:'unsuccessful'})
    }
})

// router.get('/user/matches',auth,async(req,res)=>{
//     const matches =await Matches.find({})
//     console.log(matches)
//     res.render('user/matches',{
//         match : matches,
//         title : "Matches"
//     })
// })





// router.get('/matches/status/:id',(req,res)=>{
//     res.render('user/status',{title :"Match"})
// })
 
//ONLY FOR USER 
router.get('/user/match',auth,async(req,res)=>{
    const team = await Participant.find({user_id : req.user._id}).sort({_id:-1})

    const match  =await team.map(async function(x){
       const tm = await Matches.findOne({_id : x.match_id})
       const deatil = {team : x,match: tm}
       return deatil
    })
    const matches = await Promise.all(match)
    res.send(matches)
})

// router.get('/user/team/:id',(req,res)=>{
//     res.render('user/team_update',{title :"Team Details"})
// })

// user update 
// router.post('/user/team/update',auth,async(req,res)=>{
//     try{
//         const team = await Participant.findById({_id : req.body.id})
//         if(team.user_id.toString() !== req.user._id.toString()) throw new Error("You Cannot update this team")
//         const up = await Participant.findByIdAndUpdate(req.body.id ,req.body)
//         res.redirect('/user/me')
//     }catch(e){
//         res.send({error : e.message})
//     }
// })

module.exports = router