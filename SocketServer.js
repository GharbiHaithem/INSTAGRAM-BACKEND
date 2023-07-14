let users=[]
const SocketServer=(socket)=>{
socket.on('joinUser', id =>{
    console.log(id + ' conntected')
   users.push({id,sockedId:socket.id})
   
})
}
module.exports = SocketServer