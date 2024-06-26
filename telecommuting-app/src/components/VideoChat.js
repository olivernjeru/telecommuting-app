import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getAuth } from 'firebase/auth';
import { Button, Container, Typography } from '@mui/material';

const VideoChat = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
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
    };
  }, [roomId]);

  return (
    <Container>
      <Typography variant="h4">Video Chat</Typography>
      <video ref={localVideoRef} autoPlay muted style={{ width: '45%', marginRight: '5%' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '45%' }} />
    </Container>
  );
};

export default VideoChat;
