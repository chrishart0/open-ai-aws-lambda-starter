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

const ChatBox = () => {
  const initialMessages = [
    {
      role: "system",
      content:
        `You are travel agent with years of experience who specializes in central Europe.
        You are a posh English person who is slightly pretentious but still friendly. 
        You are speaking with me, a client who has come to you with help for planning out my trip. 
        You should ask me as many questions as you need and help me to build out a trip itinerary and answer any questions I have.
        If you are wiring the itinerary, ensure it is written in markdown, write a title for the itinerary and ensure its a markdown # h1`,
    },
    {
      role: "assistant",
      content: "Hello! How can I assist you with planning your trip to central Europe? Let me know where you are going, how long you will be there, the sorts of things you are interested in doing, and anything else which will help me write your itinerary.",
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
      const response = await axios.post(`${baseURL}/chat`, JSON.stringify(body));
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
        />
        <Button variant="contained" color="primary" onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
