const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const sendMail = require('../../emails/welcome')
const app = express()
const auth = require('../../middleware/auth')
const adminAuth = require('../../middleware/adminAuth')
const userAuth = require('../../middleware/checkUserAuth')
const router =  new express.Router()
const User = require('../models/userModal')
const Winner = require('../models/winnerModal')
const Matches = require('../models/tournamentModal')
const Participant = require('../models/participantModal')

// const storage = multer.diskStorage({
//     destination : './images/winners/',
//     filename : function (req,file,cb) {
//         cb(null,)
//     }
// })
const upload = multer({
    limits :{
        fileSize  : 80000000
    }
})

router.get('/images',(req,res)=>{
    res.render('admin/winner_set')
})

router.post('/winner/image/upload',adminAuth,upload.single('image'),async(req,res)=>{
    try{
        const winner = await new Winner(req.body)
        winner.image = req.file.buffer
        await winner.save()
        res.send(req.body)
    }catch(e){
        res.send({error:e.message})
    }

})
router.get('/winners',async(req,res)=>{
    winners = await Winner.find({}).sort({_id:-1}).limit(10)
    var  x = winners.map((x)=>{
        const tt = x.toObject()
        delete tt.image
        return tt
    })
    res.send(x)
    
})

router.get('/winners/:id',async(req,res)=>{
    try{
        const _id = req.params.id.toString()
        winner = await Winner.findOne({_id})
        res.set('Content-Type','image/png')
        res.send(winner.image)   
    }catch(e){
        res.send({error:e.message})
    }

    
})

module.exports = router