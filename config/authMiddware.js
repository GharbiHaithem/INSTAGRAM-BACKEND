const jwt =require('jsonwebtoken')
const User = require('../model/user.model')
const authMiddleware = async(req,res,next)=>
{
    let token
    if(req?.headers?.authorization?.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
    console.log({token:token})
    try{
      let decode = jwt.verify(token,process.env.JWT_SECRET)
      console.log(decode)
        if(token){
            let decode = jwt.verify(token,process.env.JWT_SECRET)
           console.log({reqHeaderID:decode.id})
           console.log(typeof decode.id)
           let __user = await User.findOne({googleId : decode.id})
           console.log({request_user:__user})
           if(__user){
            req.user = __user
         
            next()
           }
        else{
          decode = jwt.verify(token,process.env.JWT_SECRET)
          let user = await User.findById(decode.id)
          console.log(user)
        console.log({request_user:user})
          req.user=user
  
          next()
        }
          
        }
     
    }catch(error){
      res.json({message:'Token not valid or expired login to connect'})
    } 
    }
    else{
    res.json({message:'There is no token attached to header'})
    }
} 
module.exports = {authMiddleware }