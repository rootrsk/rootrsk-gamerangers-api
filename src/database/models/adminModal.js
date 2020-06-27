const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required : true,
        trim : true
    },
    email: {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true
    },
    city : {
        type : String,
        required : true,
        lowercase : true,
        trim : true
    },
    contact: {
        type: Number,
        required : true,
        trim : true
    },
    password :{
        type : String,
        required : true,
        trim : true
    }
},{
    timestamps : true
})

userSchema.methods.genAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET)
    return token
}


userSchema.statics.findByCresidential = async function(email,password){
    const user = await Admin.findOne({email})
    if(!user) throw new Error("No such user found")
    if(user.password !== password) throw new Error("Password does not match")
    return user
}

const Admin = mongoose.model('Admin',userSchema)

module.exports = Admin