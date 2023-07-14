const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const UserSchema =new mongoose.Schema({
  firstname:{
    type:String,
 
},
lastname:{
    type:String,
 
},
mobile:String, 
  email:String,
  password:String,
  pic:[{
    public_id:String,
    url:String,

}],
  couverture:{
    type:String,
    default:""
  },
  token:String,
  valid :{
    type:Boolean,
    default:true
  },
  refreshToken:{
    type:String
},
passwordChangedAt:Date,
passwordResetToken:String,
passwordResetExpires:Date,
followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
  
},{
  timestamps:true
})
UserSchema.pre('save',async function(next){
    if(!this.isModified("password")){next()}
const salt = bcrypt.genSaltSync(10)
this.password = await bcrypt.hash(this.password,salt)
})
UserSchema.methods.IsPasswordMatched = async function(entryPassword){
    return await bcrypt.compare(entryPassword,this.password)
}
UserSchema.methods.createPasswordResetToken= async function(){
const resetToken = crypto.randomBytes(32).toString("hex")
this.passwordResetToken=crypto.createHash("sha256")
.update(resetToken)
.digest("hex") 
this.passwordResetExpires=Date.now() + 30 * 60 * 1000 // 10 minutes
return resetToken
}
module.exports = mongoose.model('User', UserSchema)