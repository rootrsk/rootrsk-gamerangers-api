const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    team_name: {
        type:String,
        trim : true,
        required : true,
    },
    email: {
        type:String,
        trim : true,
        // required : true,
    },
    team_leader : {
        type : String,
        trim : true,
        required : true,
    },
    contact_no: {
        type: Number,
        trim : true,
        required : true
    },
    player_1 :{
        type : String,
        trim : true,
        required : true,
    },
    player_2 :{
        type : String,
        trim : true
    },
    player_3 :{
        type : String,
        trim : true
    },
    player_4 :{
        type : String,
        trim : true
    },
    match_id:{
        type: String,
        trim: true
    },
    user_id:{
        type : String,
        trim : true
    },
    payment_status: {
        type : Number,
    },
    payment_method: {
        type : Number
    },
    payment_id:{
        type: String
    },
    prize_status : {
        type : Number,
    },
    prize_amount : {
        type : Number
    }
},{
    timestamps : true
})
userSchema.methods.publicProfile =  function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.email
    delete userObject.team_leader
    delete userObject.match_id
    delete userObject.user_id
    delete userObject.__v
    return userObject
}
const Participant = mongoose.model('Participant',userSchema)

module.exports = Participant