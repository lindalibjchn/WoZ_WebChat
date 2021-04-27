const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const cors = require('cors');

const config = require("./config/config")

const PORT = process.env.PORT || 5000;

const router = require('./router');
const {addUser, removeUser, getUsersInRooms, getUser} = require('./users');

//connect mongodb
const mongoose = require("mongoose");
const connect = mongoose.connect(config.dev_mongoURI,
    {
        useNewUrlParser:true, useUnifiedTopology:true,
        useCreateIndex: true, useFindAndModify: false
    })
    .then(()=>console.log('MongoDB Connected...'))
    .catch(err=>console.log(err));

// mongoose.Promise = global.Promise;
//setup socket.io
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// const ENDPOINT = "http://localhost:3000";
const ENDPOINT = "https://rt-webchatapp-v5.netlify.app";

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', ENDPOINT); //for product
    res.header('Access-Control-Allow-Credentials', "true");
    next();
});


//Yuvi - adding next line to get user name at client side -
const allUsersDetails = {};

//setup api
require('./routes')(app); //other api
app.use(router);
app.use(cors());
//runningserver
var serverapp = app.listen(PORT, ()=>console.log(`Server has started on port ${PORT}`));


const server = http.createServer(app);
const io = socketio.listen(serverapp)

const usersid = {};
io.on('connection', (socket)=>{
    // console.log('we have a new connection!!!');

    socket.on('join', ({ name, room }, callback)=>{

        if(!usersid[socket.id]){
            usersid[socket.id] = socket.id;
        }

        socket.broadcast.emit("currentuserId", socket.id);
        io.sockets.emit("allUsersid", usersid);

        console.log("currentuserId is:",socket.id);
        console.log("usersid is:",usersid);

        const { error, user } = addUser({id: socket.id, name, room});
        console.log(user)
        if(error) return callback(error);

        //Yuvi begin- adding next block to get user name and room details at client side -
        io.sockets.emit("userDetails", user);
        if(!allUsersDetails[socket.id]){
            allUsersDetails[socket.id] = user;
        }
        console.log("Users Details in a Dictionary :",allUsersDetails )
        io.sockets.emit("allUsersDetails", allUsersDetails);
        console.log("Extracting from Users Details :",allUsersDetails[socket.id].id)
        //Yuvi end

        socket.join(user.room);

        socket.emit('message', {user:'admin', text:`${user.name}, welcome to the room ${user.room}`});
        socket.emit('message', {user:'admin', text:`Hello ${user.name}, Message from researcher, during chatting with Julia, you only need to speak with her and without typing any messages, \n
        but if you need any help from the researcher, please type messages on this chatbox. \n We start now :)...`});

        console.log('welcome')
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text:`${user.name}, has joined!`})

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRooms(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRooms(user.room)});
        callback();
    })

    //Yuvi - changing 'callin' to 'hey'
    socket.on("callUser", (data)=>{
        socket.broadcast.emit('hey', {signal: data.signalData, from: "admin"});
        console.log("callUser event, data.from is:",data.from);
        console.log("callUser event, allUsersDetails is:",allUsersDetails[data.from]);
        console.log("callUser event, data.signalData is:",data.signalData);
    })

    socket.on("acceptCall", (data)=>{
        socket.broadcast.emit('callAccepted', data.signal);
    })
    // peer call end

    socket.on('disconnect', ()=>{

        delete allUsersDetails[socket.id];  //added -4/Dec for sending user name to client
        delete usersid[socket.id];  //added for peer part
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left.`})
        }
    })
})

module.exports = app;