import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, List, ListItem, ListItemText, Typography, Snackbar, Alert } from '@mui/material';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import VideoChat from './VideoChat';

const Chat = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [error, setError] = useState(''); // State for validation error
  const auth = getAuth();
  const user = auth.currentUser;

  // Reference to the chat container div
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const q = query(collection(db, `rooms/${roomId}/messages`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!roomId || !message.trim()) {
      setError('Please type in a message to send');
      return;
    }

    setError('');
    setMessage('');

    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text: message,
      user: user.email,
      timestamp: new Date(),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in TextField
      sendMessage();
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <Container>
      <Typography variant="h4">Chat Room</Typography>
      <div
        ref={chatContainerRef}
        style={{ maxHeight: '60vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
      >
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText primary={msg.text} secondary={msg.user} />
            </ListItem>
          ))}
        </List>
      </div>
      <TextField
        label="Type a message to send"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter key
        fullWidth
        margin="normal"
        multiline
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
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Chat;
