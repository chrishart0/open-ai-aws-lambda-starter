import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssistantIcon from '@mui/icons-material/Assistant';
import ReactMarkdown from 'react-markdown';

const baseURL = "http://localhost:4000";

const ChatBox = (aiDefinition, aiInitialMessage) => {

  const initialMessages = [
    {
      role: "system",
      content: aiDefinition['aiDefinition'], //ToDo: No idea why I need to access the string like this. Why can't I just look into aiInitialMessage, why do I need to go 1 level in?
    },
    {
      role: "assistant",
      content: aiDefinition['aiInitialMessage'],
    },
  ];


  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(initialMessages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const userMessage = { role: "user", content: message };
    setChatHistory([...chatHistory, userMessage]);

    const body = {
      message: [...chatHistory, userMessage],
    };

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/chat`, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setChatHistory(response.data.message);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error(err);
    }
  };

  const isMarkdown = (text) => {
    return text.startsWith('# ') || text.startsWith('## ') || text.startsWith('### ');
  }

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() !== "") {
        sendMessage();
      }
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ width: "80%", mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        component={Paper}
        sx={{
          width: "80%",
          height: "70vh",
          mt: 2,
          p: 2,
          overflowY: "auto",
        }}
      >
        {chatHistory
          .filter((chat) => chat.role !== "system")
          .map((chat, i) => (
            <React.Fragment key={i}>
              <Box
                sx={{
                  mb: 2,
                  p: 1,
                  bgcolor: chat.role === "user" ? "#F0F8FF" : "#E6E6FA",
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar>
                      {chat.role === "user" ? <AccountCircleIcon /> : <AssistantIcon />}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography>
                      <strong>{chat.role}:</strong> {chat.role === "assistant" ? <ReactMarkdown>{chat.content}</ReactMarkdown> : chat.content}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        {loading && <CircularProgress />}
      </Box>
      <Box
        sx={{
          width: "80%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          inputProps={{
            onKeyDown: handleKeyDown
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => { if (message.trim() !== "") sendMessage(); }}
          disabled={loading || !message.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
