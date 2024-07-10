import * as React from "react";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton, Badge } from "@mui/material";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { auth, firestoredb, storage } from "../../../firebase";
import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState, useRef } from "react";
import { ref, getDownloadURL } from 'firebase/storage';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);
  const [patients, setPatients] = useState([]);
  const [patientData, setPatientData] = useState({ profilePictureUrl: "", displayName: "", phoneNumber: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      setError("Enter a valid message");
      setTimeout(() => setError(null), 1500);
      return;
    }
    const { uid, email } = auth.currentUser;
    const roomId = [uid, selectedPatientId].sort().join("_");

    try {
      const roomDocRef = doc(collection(firestoredb, 'chats'), roomId);
      const messagesSubCollectionRef = collection(roomDocRef, 'messages');

      await addDoc(messagesSubCollectionRef, {
        text: message,
        email: email,
        createdAt: serverTimestamp(),
        uid,
        read: false,
      });

      setMessage("");
    } catch (error) {
      setError("Failed to send message");
      setTimeout(() => setError(null), 1500);
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsQuery = query(collection(firestoredb, 'user-details'), orderBy('displayName'));
        const unsubscribe = onSnapshot(patientsQuery, (querySnapshot) => {
          const patientsData = [];
          querySnapshot.forEach((doc) => {
            const patientData = doc.data();
            if (patientData.registrationNo.startsWith('P')) {
              patientsData.push({ id: doc.id, displayName: patientData.displayName });
            }
          });
          setPatients(patientsData);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching market makers:', error);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const markMessagesAsRead = async (patientId) => {
    const roomId = [auth.currentUser.uid, patientId].sort().join("_");
    const roomDocRef = doc(firestoredb, 'chats', roomId);
    const messagesQuery = query(
      collection(roomDocRef, 'messages'),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(messagesQuery);
    querySnapshot.forEach(async (messageDoc) => {
      if (messageDoc.data().uid !== auth.currentUser.uid && !messageDoc.data().read) {
        await updateDoc(doc(roomDocRef, 'messages', messageDoc.id), { read: true });
      }
    });

    setUnreadMessages((prev) => ({
      ...prev,
      [patientId]: false,
    }));
  };

  useEffect(() => {
    let unsubscribe;
    const fetchMessages = async () => {
      if (selectedPatientId) {
        const roomId = [auth.currentUser.uid, selectedPatientId].sort().join("_");
        const roomDocRef = doc(firestoredb, 'chats', roomId);
        const messagesQuery = query(
          collection(roomDocRef, 'messages'),
          orderBy("createdAt", "asc")
        );
        unsubscribe = onSnapshot(messagesQuery, (QuerySnapshot) => {
          const fetchedMessages = [];
          QuerySnapshot.forEach((doc) => {
            const messageData = doc.data();
            fetchedMessages.push({ ...messageData, id: doc.id });

            // Update last message timestamp and unread status
            setLastMessages((prev) => ({
              ...prev,
              [selectedPatientId]: messageData.createdAt?.toDate(),
            }));
            if (messageData.uid !== auth.currentUser.uid && !messageData.read) {
              setUnreadMessages((prev) => ({
                ...prev,
                [selectedPatientId]: true,
              }));
            }
          });
          setMessages(fetchedMessages);

          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }

          // Mark messages as read when fetching new messages if the chat area is already active
          markMessagesAsRead(selectedPatientId);
        });
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedPatientId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePatientClick = async (patientId) => {
    setSelectedPatientId(patientId);
    try {
      const patientDocRef = doc(firestoredb, 'user-details', patientId);
      const patientDocSnapshot = await getDoc(patientDocRef);

      if (patientDocSnapshot.exists()) {
        const patientData = patientDocSnapshot.data();
        const { displayName, phoneNumber } = patientData;

        // Try fetching profile picture, handle if it doesn't exist
        let profilePictureUrl = "";
        try {
          const storageRef = ref(storage, `user_details/profile_pictures/${patientId}`);
          profilePictureUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.log("Profile picture does not exist or error fetching:", error);
        }

        setPatientData({ profilePictureUrl, displayName, phoneNumber });

        // Mark messages as read
        await markMessagesAsRead(patientId);
      } else {
        console.log('No such market maker document!');
      }
    } catch (error) {
      console.error('Error fetching market maker details:', error);
    }
  };

  useEffect(() => {
    const unsubscribeList = [];

    const listenForMessages = (patientId) => {
      const roomId = [auth.currentUser.uid, patientId].sort().join("_");
      const roomDocRef = doc(firestoredb, 'chats', roomId);
      const messagesQuery = query(
        collection(roomDocRef, 'messages'),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        let hasUnreadMessages = false;
        let lastMessageTime = null;

        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          if (messageData.uid !== auth.currentUser.uid && !messageData.read) {
            hasUnreadMessages = true;
          }
          lastMessageTime = messageData.createdAt?.toDate();
        });

        setUnreadMessages((prev) => ({
          ...prev,
          [patientId]: hasUnreadMessages,
        }));

        setLastMessages((prev) => ({
          ...prev,
          [patientId]: lastMessageTime,
        }));
      });

      return unsubscribe;
    };

    patients.forEach((patient) => {
      const unsubscribe = listenForMessages(patient.id);
      unsubscribeList.push(unsubscribe);
    });

    return () => {
      unsubscribeList.forEach(unsubscribe => unsubscribe());
    };
  }, [patients]);

  const filteredPatients = patients.filter((patient) =>
    patient.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#112240' }}>
      <Box sx={{ ml: -3, padding: 1, maxHeight: '43vh', overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#D9D9D9', borderRadius: '4px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#112240' } }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 1, mt: 1, }}
          value={searchTerm}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="search">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '& input': {
                color: 'white',
              }
            }
          }}
          InputLabelProps={{
            style: {
              color: 'white',
            }
          }}
        />
        <Divider sx={{ backgroundColor: 'white' }} />
        <List>
          {filteredPatients.map((patient) => (
            <ListItem key={patient.id} disablePadding>
              <ListItemButton onClick={() => handlePatientClick(patient.id)}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ color: 'white' }}>
                      {patient.displayName}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {lastMessages[patient.id] ? lastMessages[patient.id].toLocaleString() : "Start a new chat"}
                    </Typography>
                  }
                />
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={!unreadMessages[patient.id]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ backgroundColor: "white", mr: 2 }} />
      <Box
        sx={{
          height: "43vh",
          width: '50%',
          display: "flex",
          flexDirection: "column",
          padding: '1%',
          mr: 1,
          overflowY: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={patientData.profilePictureUrl} alt="Market Maker" sx={{ width: 50, height: 50, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>
              {patientData.displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              Phone Number: {patientData.phoneNumber}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: 'white' }} />
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: 'scroll',
            paddingRight: 2,
            maxHeight: 'calc(40vh - 110px)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D9D9D9',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#112240',
            },
          }}
        >
          {messages.map(({ id, text, email, createdAt, uid }) => (
            <Box key={id} sx={{ textAlign: uid === auth.currentUser.uid ? 'right' : 'left' }}>
              <Typography variant="body2" color="#999999">
                {email} - {createdAt?.toDate().toLocaleString()}
              </Typography>
              <Typography variant="body1">{text}</Typography>
            </Box>
          ))}
        </Box>
        {error && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#f44336',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              zIndex: '999',
              transition: 'opacity 0.5s',
              opacity: 1,
            }}
          >
            {error}
          </Paper>
        )}
        <Paper
          component="form"
          onSubmit={sendMessage}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "2px 4px",
            mt: 1,
            boxShadow: "none",
            backgroundColor: "transparent",
          }}
        >
          <TextField
            label="Type your message"
            variant="outlined"
            size="small"
            fullWidth
            value={message}
            onChange={handleMessageChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '& input': {
                  color: 'white',
                }
              }
            }}
            InputLabelProps={{
              style: { color: 'white' }
            }}
          />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            Send
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
