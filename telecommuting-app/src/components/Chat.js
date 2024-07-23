import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestoredb } from '../firebase';
import { getAuth } from 'firebase/auth';
import VideoChat from './VideoChat';

const Chat = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!roomId) return;

    const q = query(collection(firestoredb, `rooms/${roomId}/messages`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (!roomId || !message.trim()) return;

    const auth = getAuth();
    const user = auth.currentUser;

    setMessage('');

    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text: message,
      user: user.email,
      timestamp: new Date(),
    });
  };

  return (
    <Container>
      <Typography variant="h4">Chat Room</Typography>
      <List>
        {messages.map((msg) => (
          <ListItem key={msg.id}>
            <ListItemText primary={msg.text} secondary={msg.user} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowVideo(!showVideo)}
        style={{ marginLeft: '10px' }}
      >
        {showVideo ? 'End Video Call' : 'Start Video Call'}
      </Button>
      {showVideo && <VideoChat roomId={roomId} user={user} />}
    </Container>
  );
};

export default Chat;
