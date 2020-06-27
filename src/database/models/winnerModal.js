const mongoose = require('mongoose')

const winnerSchema =new mongoose.Schema ({
    team_id:{
        type:String,
        required : true,
    },
    match_id:{
        type:String,
        required : true
    },
    prize:{
        type : Number,
        required : true
    },
    image:{
        type : Buffer,
        required: true
    }
},{
    timestamps : true
})

const Winner = mongoose.model('Winner',winnerSchema)

module.exports = Winner