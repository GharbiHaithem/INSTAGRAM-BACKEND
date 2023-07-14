const { generateRefreshToken, generateToken } = require('../config/jwtToken')
const User = require('../model/user.model')
const sendEmail = require('./emailCtrl')
const userCtrl = {
    createUser: async (req, res) => {
    const { email  } = req.body
        const findUser = await User.findOne({ email:req.body.email })
        try {
            if (!findUser) {
                //create new user
                const newUser = await User.create(req.body)
                return res.status(200).json(newUser)
            } else {
                return res.status(500).json({
                    msg: 'User Already Exist',
                    success: false
                })
            }
        }
        catch (err) {
            res.json({ msg: err.message })
        }



    },
    loginUser: async (req, res) => {
        const { email, password } = req.body

        const findUser = await User.findOne({ email }).populate("followers following")
        if (findUser && (await findUser.IsPasswordMatched(password))) {
            const refreshToken = generateRefreshToken(findUser?._id)
            const updateUser = await User.findByIdAndUpdate(findUser._id, {
                refreshToken: refreshToken
            }, {
                new: true,
                upsert: true
            })
          
            res.json({
                _id: findUser._id,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                mobile: findUser.mobile,
                pic:findUser.pic,
                token: generateToken(findUser._id),
                following:findUser.following,
                followers:findUser.followers,
            })
        } else {
            res.status(500).json({ message: 'invalid credentials' })
        }
    },
    forgotPasswordToken: async (req, res) => {
        const { email } = req.body
        console.log(email)
        const user = await User.findOne({ email })
        if (!user) res.status(500).json({ message: 'user not found with this email' })
        try {
            const token = await user.createPasswordResetToken()
            console.log(token)
            await user.save()
            const resetURL = `Hi , Please Fllow this Link  to reset your password . this Link till 10 minutes from now <a  href='http://localhost:3000/resetPassword/${token}'>click here</a>`
            const data = {
                to: email,
                text: "Hey user",
                subject: "forgot password",
                htm: resetURL,
            }
            sendEmail(data)
            res.json({ token, message: 'a validation link is sent to your email box' })
        } catch (err) {
            res.json({ message: err })
        }
    },
    getalluser:async(req,res)=>{
        try {
            const users = await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.json({message:error.message})
        }
    },
    getSussegtionUser:async(req,res)=>{
        try{
            let arr;
            console.log(req.user.id)
            const _user = await User.findById(req.user.id)
            arr = [..._user?.following,_user?._id]; 
            console.log({aaaaaa:arr})
           
            let filter = {
                _id:{
                    $nin : arr
                }
            }
            console.log(_user);
            let x =await  User?.find(filter)
            console.log({wwwwwwwwwwwwww:x})
            res.json(x)
          
    
        //   const suggestUser = await U   
        }catch(err){
          res.status(500).json({message:err.message})
        }
    },
    follow:async(req,res)=>{
        try {
            const user= await User.find({_id:req.params.id,followers:req.user.id}).populate('followers following')
   
  

            if(user.length>0) return res.status(500).json({msg:'You are Followed'})
         
          const newuser =  await User.findOneAndUpdate({_id:req.params.id},{
             $push:{followers:req.user.id}},{new:true} ).populate("followers following","-password")
             await User.findOneAndUpdate({_id:req.user.id},{
                 $push:{following:req.params.id}},{new:true} )
             res.json({newuser})
        }
        catch(err){

        }
    },
    unfollow:async(req,res)=>{
        const newuser = await User.findOneAndUpdate({_id:req.params.id},{
            $pull:{followers:req.user.id}},{new:true} ).populate("followers following","-password")
            await User.findOneAndUpdate({_id:req.user.id},{
                $pull:{following:req.params.id}},{new:true} )
            res.json({newuser})
    },
    refreshUser : async(req,res)=>{
        try {
            const getoneuser = await User.findById(req.user.id)
            res.json(getoneuser)
        } catch (error) {
            res.json({message:error.message})
        }
    },
    getOneUser : async(req,res)=>{
        try{
const user = await User.findById(req.params.id).populate("followers following","-password")
res.status(200).json(user)
        }catch(err){
            res.json({message:err.message})
        }
    },
    getUserbySearch:async(req,res)=>{
        const {searchQuery} =  req.query;
   
        try{
            let arr=[];
        const title = new RegExp(searchQuery , "i");
        const user = await User.findById(req.user.id)
        console.log({"MY FOLLOWING " : user.following})
        const result = await User.find( {  _id: { $in: user.following } , $or: [
            { firstname: title },
            { lastname: title }
          ]});
        console.log(result)
        res.status(200).json(result);  
        }
        catch(err){
        res.status(404).json({message:'somthing went rong'});
        }
    },
    updateProfileUser:async(req,res)=>{
        try{
         const user = await User.findByIdAndUpdate(req.user.id,{
            pic:req.body.pic
         })
         res.json(user)
        }catch(err){
            res.status(404).json({message:'somthing went rong'});
        }
    }
    
}
module.exports = userCtrl