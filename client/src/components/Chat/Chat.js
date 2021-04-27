import React, {useState, useEffect} from "react";
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import TextContainer from '../TextContainer/TextContainer';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import WebRTC from "../WebRTC/WebRTC";
import onlineIcon from "../../icons/onlineIcon.png";
import {ENDPOINT} from "../../utils/storage";

let socket;

const Chat = ({ location }) =>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');

    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        const {room, name} = queryString.parse(location.search);
        console.log(location.search);
        // console.log(name, room);
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, (error)=>{
            if(error) {
                alert(error);
            }
        });

    },[ENDPOINT, location.search]);

    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages(messages =>[...messages, message]);
        })

        socket.on("roomData", ({users}) =>{
            setUsers(users)
        });

    }, []);

    //function for sending messages
    const sendMessage = (event) => {

        event.preventDefault();
        if(message) {
           socket.emit('sendMessage', message, ()=>setMessage(''));
         }
    }

    return(
        <div className="outerContainer">
            <div className="webrtc">
                <WebRTC name = {name} room={room} endpoint={ENDPOINT} />
            </div>
            <div className="message">
                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>

            <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;