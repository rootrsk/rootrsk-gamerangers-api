const express = require('express')
const path = require('path')
const userRouter = require('./src/routes/user')
const hbs  = require('hbs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('./src/database/mongoose')



const userRouters = require('./src/database/routers/user')
const matchRouters= require('./src/database/routers/matches')
const adminRouters= require('./src/database/routers/admin')
const participantRouters = require('./src/database/routers/participant')





const app = express()
const port =  process.env.PORT 
app.use(express.json())
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true}))

app.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', '*')

    // Website you wish to allow to connect
    const allowedOrigins = ['https://rootrsk.github.io','http://localhost:3000'];
    const origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Headers', true)

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use(userRouter)
app.use(userRouters)
app.use(adminRouters)
app.use(matchRouters)
app.use(participantRouters)

console.log(__dirname)
const publicDir = path.join(__dirname,'public')
console.log(publicDir)


app.set('view engine','hbs')
app.set('views',publicDir)


const user = {
    name : "ravi",
    age : 20 ,
    gender : "male"
}

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/help',(req,res)=>{
    res.send('This is help page')
})




app.listen(port,()=>{
    console.log(`server Started at port ${port}`)
})

