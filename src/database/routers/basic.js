const express = require('express')
const jwt = require('jsonwebtoken')
const sendMail = require('../../emails/welcome')
const app = express()
const auth = require('../../middleware/auth')
const router =  new express.Router()
const User = require('../models/userModal')
const Matches = require('../models/tournamentModal')
const Participant = require('../models/participantModal')


router.get('',(req,res)=>{
    res.render('index',{title :"Gamerangers"})   
})

router.get('/help',(req,res)=>{
    res.render('help',{title :"Help"})
})
router.get('/about',(req,res)=>{
    res.render('about')
})
router.get('*', function(req, res){
    res.send('Page not found');
})

module.exports  = router
