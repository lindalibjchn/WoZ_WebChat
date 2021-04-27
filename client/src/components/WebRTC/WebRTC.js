import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Form, Button, Alert, Col } from "react-bootstrap";

import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import Message from "../Message/Message";

import {ENDPOINT} from "../../utils/storage";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 50%;
`;

const Video = styled.video`
  border: 1px solid blue; 
  width: 100%;
  height:100%;   
`;

const WebRTC =({name, room}) => {
  const [currentuserId, setYourID] = useState("");
  const [usersid, setUsers] = useState({}); //changed users to usersid
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const senders = useRef([]);
  const userStream = useRef();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
 
  //adding for user name and room name from server
  //const [userDetail, setUserDetail] = useState({});
  const userDetail = useRef();
  const allUsersDetails = {}; //useRef();

    useEffect(() => {
        socket.current = io.connect(ENDPOINT);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        if (userVideo.current) { 
            userVideo.current.srcObject = stream;
            userStream.current = stream
        }

            //Code for screen recording 
            let start = document.getElementById('btnStart');
            let stop = document.getElementById('btnStop');
            let vidSave = document.getElementById('vid2');
            let chunks = [];
            let mRecorder, screenStream, voiceStream, fullStream;
            
            const audioToggle = document.getElementById('audioToggle');
            const micAudioToggle = document.getElementById('micAudioToggle');

            const mergeAudioStreams = (screenStream, voiceStream) => {
            const context = new AudioContext();
            const destination = context.createMediaStreamDestination();
            let hasDesktop = false;
            let hasVoice = false;

            if (screenStream && screenStream.getAudioTracks().length > 0) {
                // If you don't want to share Audio from the desktop it should still work with just the voice.
                const source1 = context.createMediaStreamSource(screenStream);
                const desktopGain = context.createGain();
                desktopGain.gain.value = 0.7;
                source1.connect(desktopGain).connect(destination);
                hasDesktop = true;
            }

            if (voiceStream && voiceStream.getAudioTracks().length > 0) {
                const source2 = context.createMediaStreamSource(voiceStream);
                const voiceGain = context.createGain();
                voiceGain.gain.value = 0.7;
                source2.connect(voiceGain).connect(destination);
                hasVoice = true;
            }
            return (hasDesktop || hasVoice) ? destination.stream.getAudioTracks() : [];
            };

        async function startRecording() {
            const audio = audioToggle.checked || true;
            const mic = micAudioToggle.checked || true;

            screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" },
                audio: audio
            });

            if (mic === true) {
                voiceStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: mic });
            }

            const tracks = [
                ...screenStream.getVideoTracks(),
                ...mergeAudioStreams(screenStream, voiceStream)
            ];

            fullStream = new MediaStream(tracks);
            mRecorder = new MediaRecorder(fullStream);

  
            mRecorder.ondataavailable = function(ev) {
                chunks.push(ev.data);
            }

            mRecorder.onstop = (ev)=>{
                let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
                chunks = [];
                vidSave.style.display = "inline";
                let videoURL = window.URL.createObjectURL(blob);
                vidSave.src = videoURL;
            }
            mRecorder.start();
            }

        start.addEventListener('click', (ev)=>{
            startRecording();
            })
        stop.addEventListener('click', (ev)=>{
            mRecorder.stop();
            });
        })

        socket.current.on("currentuserId", (id) => { //was yourID
        setYourID(id);
        })
        
        socket.current.on("allUsersid", (usersid) => { //changed users to usersid
        setUsers(usersid); //changed users to usersid
        })

        socket.current.on("hey", (data) => {
            console.log("inside 'hey' event in useEffect")
            setReceivingCall(true);
            console.log("setReceivingCall flag is :",setReceivingCall)
            setCaller(data.from);
            setCallerSignal(data.signal);
          })


          //Yuvi - adding new lines to get user name and room details from server
          socket.current.on("userDetails", (userDetail) => { 
            ////setUserDetail(userDetail); 
            console.log("user name and room details are: ",userDetail)
            console.log("user name is : ",userDetail.name)
            })
          socket.current.on("allUsersDetails", (allUsersDetails) => { 
            console.log("all Users Details are :",allUsersDetails) 
            console.log("Extracting from Users Details :",userDetail[name])
            let val1 = Object.values(allUsersDetails).map(val => {
              if (val.id == !socket.ID) {
                console.log("INSIDE IF");
                return null;
             } 
             console.log("INSIDE ELSE", val.name );
             return val.name[1];
            })
            console.log("VAL1 is :", val1)
            
            })
    

    }, []); 

      function callPeer(id) {
        const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
        
        });

        let callButton = document.getElementById('callBtn');
        console.log("info from button :",callButton)
        console.log("id info from button :",callButton.id)
        console.log("name info from button :",callButton.value)

        peer.on("signal", data => {
        socket.current.emit("callUser", { userToCall: id, signalData: data, from: currentuserId })  //chnge from yourID to 
        console.log("current user id is : ",currentuserId)
        })

        //this is the stream coming from the another user
        peer.on("stream", stream => {
            console.log("partnerVideo.current value is :",partnerVideo.current)
        if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream;
        }
        });

        socket.current.on("callAccepted", signal => {
        setCallAccepted(true);
        console.log("inside call_Peer:callAccepted, callAccepted value is:", callAccepted)
        peer.signal(signal);
        })

        let screenShare = document.getElementById('shareScreen');
        
        screenShare.addEventListener('click', (ev)=>{
          userStream.current.getTracks().forEach(track => senders.current.push(track));

          navigator.mediaDevices.getDisplayMedia({ 
            video: { mediaSource: "screen" },
            audio: true,
            cursor: true }).then(screenStream => {
              const screenTrack = screenStream.getTracks()[0];
              
              console.log("Stream is : ",screenTrack)
              userVideo.current.srcObject = screenStream;
              
              console.log("SENDERS.CURRENT is : ",senders.current)
              console.log("SENDERS.CURRENT.FIND is : ",senders.current.find(sender => sender.kind === 'video'))
              
              peer.replaceTrack(senders.current.find(sender => sender.kind === 'video'), screenTrack, stream)
          
              screenTrack.onended = function() { 
                userVideo.current.srcObject = stream;
                peer.replaceTrack(screenTrack, senders.current.find(sender => sender.kind === 'video'), stream)
              }
            })

        })
        console.log("SENDERS is : ",senders)
      }

    function acceptCall() {

        //To hide buttons and divs from the participant side, once call starts
        var divLabelButton = document.getElementById('labelBtn');
        divLabelButton.style.display = 'none'
        var buttonCall = document.getElementById('callBtn');
        buttonCall.style.display = 'none'
        var buttonStartRec = document.getElementById('btnStart');
        buttonStartRec.style.display = 'none'
        var buttonStopRec = document.getElementById('btnStop');
        buttonStopRec.style.display = 'none'

        var videocontrol = document.getElementById('vid2');
        videocontrol.style.display = 'none'

        var buttonShareScreen = document.getElementById('shareScreen');
        buttonShareScreen.style.display = 'none'

        setCallAccepted(true);
        const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
        });
        peer.on("signal", data => {
        socket.current.emit("acceptCall", { signal: data, to: caller })
        console.log("inside accept call, caller is : ",caller)
        })

        peer.on("stream", stream => {
        partnerVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
    }

  let UserVideo;
    if (stream) {
        UserVideo = (
        <Video controls playsInline ref={userVideo} autoPlay />
        );
    }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video controls playsInline ref={partnerVideo} autoPlay muted="muted" />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div id="labelBtn">
          <Container>
              <Row>
                 <Alert variant="info">{ caller } is calling you, please click "Accept" start chatting</Alert>
              </Row>
              <Row>
                  <Col> <Button variant="primary" onClick={acceptCall}>Accept</Button></Col>
              </Row>
          </Container>
      </div>
    )
  }
  return (
    <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        {Object.keys(usersid).map(key => { //changed users to usersid
          if (key === currentuserId) {  //was yourID
            return null;
          }
          return (
            <Button variant="Success" id = "callBtn" onClick={() => callPeer()}>Call User</Button>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
      </Row>
        <div>
            <Button variant="primary" id="btnStart">Start Recording</Button>{' '}
            <Button variant="primary" id="btnStop">Stop Recording</Button>{' '}
            <Button variant="primary" id="shareScreen">Share Screen</Button>
        </div>
        <div>
            <video id="vid2" style={{display:"none", width:"250px", height:"250px"}} controls></video>
        </div>
        <div style={{visibility:"hidden"}}>
            <input type="checkbox" id="audioToggle"/>
            <label htmlFor="audioToggle">Capture Audio-Video from Desktop</label>
            <input type="checkbox" id="micAudioToggle"/>
            <label htmlFor="micAudioToggle">Capture Audio from Microphone</label>
        </div>
    </Container>
  );
}

export default WebRTC;