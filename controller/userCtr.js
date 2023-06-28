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
                const newUser = await User.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    mobile: req.body.mobile,
                    email:email,
                    password: req.body.password,
                    pic: req.body.pic

                })
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

        const findUser = await User.findOne({ email })
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
                token: generateToken(findUser._id)
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
}
module.exports = userCtrl