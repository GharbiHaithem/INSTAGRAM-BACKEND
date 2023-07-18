const express = require('express')
const morgan = require('morgan')
const app = express()
const authRoute = require('./route/auth.route')
const postRoute =require('./route/post.route')
const uploadRoute = require('./route/upload.route')
const commentRoute =require('./route/comment.route')
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const fs = require('fs');
const uploadVideo = require('./route/uploadVideo')
const http = require('http');
const socketIO = require('socket.io');
const chatRoute = require('./route/chat.route')
const messageRoute = require('./route/message.route')
const server = http.createServer(app);
const path = require('path')
const io = socketIO(server, {
    cors: {
      origin: 'https://social-media-acjn.onrender.com', // Remplacez par l'URL de votre client
      methods: ['GET', 'POST'],
    },
  });


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
const directory = path.join(__dirname,'public/images/products');
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}
const directory1 = path.join(__dirname, 'public/videos');
if (!fs.existsSync(directory1)) {
  fs.mkdirSync(directory, { recursive: true });
}
const onlineUser = [];

const addUser = (userId, socketId) => {
  // Vérifier si l'utilisateur n'est pas null et n'est pas déjà présent dans la liste
  if (userId && !onlineUser.some((user) => user.userId === userId)) {
    console.log("Ajout de l'utilisateur :", userId, socketId);
    onlineUser.push({ userId, socketId });
    io.emit('userListUpdated', onlineUser); // Émettre un événement personnalisé aux clients pour indiquer que la liste a été mise à jour.
  } else {
    console.log("L'utilisateur est déjà présent dans la liste ou l'ID de l'utilisateur est null :", userId, socketId);
  }
};
const removeUser = (socketId) => {
  console.log("Suppression de l'utilisateur avec socketId :", socketId);
  const disconnectedUserIndex = onlineUser.findIndex((user) => user.socketId === socketId);
  if (disconnectedUserIndex !== -1) {
    const disconnectedUser = onlineUser.splice(disconnectedUserIndex, 1)[0];
    io.emit('userListUpdated', onlineUser); // Émettre un événement personnalisé aux clients pour indiquer que la liste a été mise à jour.
    return disconnectedUser;
  }
  return null;
};

const getuser = (userId) => {
  console.log("Recherche de l'utilisateur :", userId);
  const user = onlineUser.find((user) => user.userId === userId);
  console.log("Utilisateur trouvé :", user);
  return user;
};

io.on('connection', (socket) => {
  socket.on("adduser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUser);
    io.emit('userListUpdated', onlineUser);
  });

  socket.on('disconnect', () => {
    const socketId = socket.id;
    const disconnectedUser = removeUser(socketId);
    if (disconnectedUser) {
      console.log("Utilisateur déconnecté :", disconnectedUser.userId);
    } else {
      console.log("Utilisateur non trouvé :", socketId);
    }
  });
socket.emit('useronline', onlineUser);
socket.emit('get-users',onlineUser)
// socket.on("sendNotification",({senderName,receivedName,type,datenotif})=>{
//   console.log(onlineUser)
//   console.log(receivedName,senderName,type)
//   const receiver =getuser(receivedName)
//   console.log(receiver && receiver.socketId);
// if(onlineUser.length !== 0)
//  { io.to(receiver.socketId).emit("getNotification",{senderName,type,datenotif})}
// })
// socket.on("send-message" , (data)=>{
//   const{receiverId} = data 
//   const user = onlineUser.find((user)=>user.)
// })
// socket.on("createComment",(newpost,receivedName)=>{
// console.log(newpost,receivedName);
// const receiver = getuser(receivedName)
// console.log(receiver);
// // if(onlineUser.length !== 0)
// //  { io.to(receiver.socketId).emit("createCommentToClient",newpost)}
//   })
socket.on('send-message',(data)=>{
 const {receiverId} = data;
 console.log(data)
 console.log({"user connected online ":onlineUser})
 console.log("receiverId " +receiverId)
const user = onlineUser.find((user)=>user.userId === receiverId)

console.log("sending a message to "+ receiverId)
if(user){
  console.log("socket user to receiver" + user.socketId)
  io.to(user.socketId).emit("receive-message",data)
}
})
socket.on("send-comment",(data)=>{
 console.log(data)
  const {  receiveId } = data;
  console.log({"receiveID":receiveId})
  
  console.log({"ONLINE USER":onlineUser})
  const users = [];
  receiveId.forEach((id) => {
    const user = onlineUser.find((u) => u.userId === id);
    if (user) {
      users.push(user);
    }
  });
  console.log("users: ", users);
  
  users.forEach((user) => {
    console.log("user socketId: ", user.userId);
    console.log(data)
    io.emit("verif-user" , user.socketId)
    io.emit("receive-comment", data);
  });
})

socket.on('like-dislike',(data)=>{
  console.log({"like-dislike":data})
  const{receivedId} = data
  let users = [];
  console.log({"aaaaaaa" : receivedId})
  receivedId.forEach((id) => {
    const user = onlineUser.find((u) => u.userId === id);
  
      if (user) {
      users.push(user);
    }
    console.log({"connected users id : " : users});
  });
  console.log("users: ", users);
  users.forEach((user) => {
    console.log("user socketId: ", user.userId);
    console.log(data)
    io.emit("verif-user" , user.socketId)
    io.to(user.socketId).emit('receive-like-dislike' ,data)


  });
   

  
})
  });

const filePath = path.join(__dirname,'public/videos');
fs.writeFile(filePath, '', function(err) {
    if (err) {
        console.log('Impossible de créer le fichier.');
    } else {
        console.log('Le fichier a été créé avec succès.');
    }
});

  
app.use('/api',authRoute)
app.use('/api',postRoute)
app.use('/api',uploadRoute)
app.use('/api',uploadVideo)
app.use('/api',commentRoute)
app.use('/api',chatRoute)
app.use('/api',messageRoute)
server.listen(PORT, ()=>{
    console.log(`server is running at PORT ${PORT}`)
}) 