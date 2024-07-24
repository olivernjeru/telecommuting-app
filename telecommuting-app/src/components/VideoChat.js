import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getAuth } from 'firebase/auth';
import { Button, Container, Typography, Box, Grid, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const VideoChat = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();
  const localStream = useRef();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream.current = stream;
      localVideoRef.current.srcObject = stream;
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });

      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          s.emit('signal', { roomId, candidate: event.candidate });
        }
      };

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      s.on('signal', async (data) => {
        if (data.candidate) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }

        if (data.offer) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          s.emit('signal', { roomId, answer });
        }

        if (data.answer) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      });

      s.on('user-connected', async (userId) => {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        s.emit('signal', { roomId, offer });
      });

      s.on('user-disconnected', () => {
        remoteVideoRef.current.srcObject = null;
      });

      s.emit('join-room', roomId);
    });

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (socket) {
        socket.disconnect();
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

  const toggleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4, mb: 4 }}>
        Video Chat
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              You
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Remote User
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton onClick={toggleAudio} color={isAudioMuted ? "default" : "primary"}>
          {isAudioMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        <IconButton onClick={toggleVideo} color={isVideoOff ? "default" : "primary"}>
          {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
        </IconButton>
      </Box>
    </Container>
  );
};

export default VideoChat;