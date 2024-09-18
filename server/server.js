const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const Messages = require('./models/Messages');
const Participants = require('./models/Participants');
const User = require('./models/Users');

const app = express();
app.use(express.json());
dotenv.config();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
});

const userSocketMap = {};

io.on('connection',(socket)=>{
    console.log('socket connected', socket.id)

    socket.on('register', async (userId) => {
        userSocketMap[userId] = socket.id;
        try {
          await User.findByIdAndUpdate(userId, { status: true });
          console.log(`User ${userId} registered and set to online`);
          const onlineUsers = await User.find({ _id: { $in: Object.keys(userSocketMap) } });
          io.emit('update online users', {success: onlineUsers});
        } catch (error) {
          console.error('Error updating user status:', error);
        }
      });

    socket.on('send message',async(msg)=>{
        const { sender, receiver, message } = msg;
        const new_messages = await new Messages({sender, receiver, message});
        let participant = await Participants.findOne({ sender, receiver });
        if (!participant) {
            participant = new Participants({ sender, receiver, messages: [new_messages._id] });
        } else {
            participant.messages.push(new_messages._id);
        }
        await new_messages.save();
        await participant.save();
        const receiverSocketId = userSocketMap[receiver];
        io.to(receiverSocketId).emit('receive message', message);
    })

    socket.on('update participant',()=>{
      io.emit('delete participant','success')
    })

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        const userId = Object.keys(userSocketMap).find(id => userSocketMap[id] === socket.id);
    
        if (userId) {
          delete userSocketMap[userId];
          try {
            await User.findByIdAndUpdate(userId, { status: false });
            console.log(`User ${userId} set to offline`);
            const onlineUsers = Object.keys(userSocketMap);
            io.emit('update online users', onlineUsers);
          } catch (error) {
            console.error('Error updating user status:', error);
          }
        }
      });
})

const signupuser = require('./routers/user_routes');
const loginuser = require('./routers/user_routes');
const userdata = require('./routers/user_routes');
const profiledata = require('./routers/user_routes');
const changepassword = require('./routers/user_routes');
const searchuser = require('./routers/user_routes');
const updateprofile = require('./routers/user_routes');
const participants = require('./routers/participants_routes');
const blockusers = require('./routers/user_routes');
const deleteparticipants = require('./routers/participants_routes');
const unblockusers = require('./routers/user_routes');
const getusermessages = require('./routers/participants_routes');

app.use('/signup/user',signupuser);
app.use('/login/user',loginuser);
app.use('/userdata', userdata);
app.use('/profile', profiledata);
app.use('/update/password', changepassword);
app.use('/search/user',searchuser);
app.use('/update/profile',updateprofile);
app.use('/participants', participants);
app.use('/block/users', blockusers);
app.use('/delete/messages', deleteparticipants);
app.use('/unblockuser',unblockusers);
app.use('/user/messages', getusermessages);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("database connected"))
.catch((error)=>console.log(error))

server.listen(5000,()=>{
    try {
        console.log("server started successfully")
    } catch (error) {
        console.log(error)
    }
});