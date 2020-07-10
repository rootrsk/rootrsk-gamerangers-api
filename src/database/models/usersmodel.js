const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required : true,
        trim : true,
    },
    email: {
        type:String,
        unique: true,
        trim :true,
        lowercase : true,
        required : true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("Invalid Email")            
        }
    },
    city : {
        type : String,
        required : true,
        lowercase : true,
        trim : true
    },
    contact_no: {
        type: Number,
        required : true,
        lowercase : true,
        trim : true,
    },
    password :{
        type : String,
        required : true,
        trim : true
    },
    solo_team:{
        type: String,
        trim: true
    },
    duo_team:{
        type: String,
        trim: true

    },
    squad_team:{
        type: String,
        trim: true
    }
},{
    timestamps : true
})

userSchema.methods.genAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET)
    return token
}
userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
    
}

userSchema.statics.findByCresidential = async function(email,password){
    const user = await User.findOne({email})
    console.log(user)
    if(!user) throw new Error("No such user found")
    if(user.password !== password) throw new Error("Password does not match")
    return user
}

const User = mongoose.model('User',userSchema)

module.exports = User