const mongoose = require('mongoose')
try{
    mongoose.connect(process.env.MONGODB_URL_GM,{
        useNewUrlParser: true,
        useCreateIndex:true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },()=>{
        console.log("Connected to data")
    })
    
 } catch(e){
     console.log(e.message)
 }


