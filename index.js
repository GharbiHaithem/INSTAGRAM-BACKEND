const express = require('express')
const morgan = require('morgan')
const app = express()
const authRoute = require('./route/auth.route')
const postRoute =require('./route/post.route')
const uploadRoute = require('./route/upload.route')
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(cors({
    origin:process.env.BASE_URL_FRONT,
   
    credentials:true
}))
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.connect(process.env.MONGO_URI,
    {
        UseNewUrlParser:true,
        useUnifiedTopology:true,
      
    }
).then(()=>{
    console.log(`database connected succseffuly`)
}).catch((err)=>{
    console.log(`error connexion in database ${err}`)
})
app.use('/api',authRoute)
app.use('/api',postRoute)
app.use('/api',uploadRoute)

app.listen(PORT, ()=>{
    console.log(`server is running at PORT ${PORT}`)
}) 