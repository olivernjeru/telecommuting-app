import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { Button, Grid, Typography } from '@mui/material';

const VideoChat = ({ roomId, user }) => {
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3001");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socketRef.current.emit("join-room", roomId, user.uid);

    socketRef.current.on("user-connected", userId => {
      callUser(userId);
    });

    socketRef.current.on("signal", data => {
      if (!callAccepted) {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      }
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const callUser = (userId) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socketRef.current.emit("signal", { roomId, to: userId, from: user.uid, signal: data });
    });

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socketRef.current.on("signal", data => {
      peer.signal(data.signal);
    });

    setPeer(peer);
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socketRef.current.emit("signal", { roomId, to: caller, from: user.uid, signal: data });
    });

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    setPeer(peer);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Video Chat</Typography>
      </Grid>
      <Grid item xs={6}>
        <video playsInline muted ref={userVideo} autoPlay style={{ width: "100%" }} />
      </Grid>
      <Grid item xs={6}>
        {callAccepted && (
          <video playsInline ref={partnerVideo} autoPlay style={{ width: "100%" }} />
        )}
      </Grid>
      <Grid item xs={12}>
        {receivingCall && !callAccepted && (
          <Button variant="contained" color="primary" onClick={acceptCall}>
            Accept Call
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default VideoChat;