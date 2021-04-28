const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io');
const path = require('path');
const {addUser,removeUser,getUser,getUsersInroom} = require('./utilis/users');


const publicDirectoryPath = path.join(__dirname,'../public');
const io = socketio(server);
app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log("A user connected");

    socket.on('join',({userName,roomNo},callback)=>{
        const {user,error} = addUser({id : socket.id,userName,roomNo});
        if(error)
        return callback(error);
        socket.join(roomNo);
        socket.emit('welcome',"Welcome " + userName);
        socket.to(roomNo).emit('welcome',userName + " has joined");
        const users = getUsersInroom(roomNo);
        io.to(roomNo).emit('roomData',{roomNo,users});
    })

    socket.on('chat',({userName,message,time,roomNo})=>{
        console.log("Ha ji");
        console.log(userName,message,roomNo,time);
        socket.to(roomNo).emit('message',{userName,message,time});
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if (user) {
            const userName = user.userName;
            const roomNo = user.roomNo;
            io.to(user.roomNo).emit('welcome',userName + " has left the room!")
            socket.to(roomNo).emit('roomData', {
                roomNo,
                users: getUsersInroom(roomNo)
            })
        }
    })

})
const port = 3000 || process.env.port;

server.listen(port,()=>{
    console.log("Server is listening");
})