const mongoose = require('mongoose')

const matchSchema =new mongoose.Schema ({
    time:{
        type:Date,
        unique:true
    },
    finish:{
        type : Boolean,
        default:false
    },
    winner:{
        type:String
    },
    match_status : {
        type : Number,
        required : true
    },
    winning_prize:{
        type : Number,
        required : true
    },
    entry_fee:{
        type :Number,
        required : true
    },
    room_id:{
        type:Number,
    },
    room_password:{
        type: String,
    },
    youtube_link:{
        type : String,
    },
    payment_link: {
        type : String,
        trim : true
    },
    teams:[{
        _id:false,
        team_id:{
            type:String,
            unique:true
        }
    }],
    per_kill_prize : {
        type : Number,
    },
    match_type : {
        type : Number
    }
},{
    timestamps : true
})


const Match = mongoose.model('Match',matchSchema)

module.exports = Match