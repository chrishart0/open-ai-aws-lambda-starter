import { useState, useEffect } from 'react';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import axios from 'axios';


// Components
import ChatBox from '../components/ChatBox';

const baseURL = "http://localhost:4000";

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [currentPromptDetails, setCurrentPromptDetails] = useState([]);

  // Load data on component mount
  useEffect(() => {
    getPrompts()
    setPromptDetails('ai_travel_agent.json')
  }, []);


  const getPrompts = async () => {
    // setLoading(true);
    console.log("Getting prompts")

    try {
      const response = await axios.get(`${baseURL}/prompts`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      setPrompts(response.data.prompts);
      // setLoading(false);
    } catch (err) {
      // setError(err.message);
      // setLoading(false);
      console.error(err);
    }
  };

  const setPromptDetails = async (prompt) => {
    // setLoading(true);
    console.log(`Getting ${prompt} prompts`)

    try {
      const response = await axios.get(`${baseURL}/prompts/prompt?prompt_name=${prompt}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
      setCurrentPromptDetails(response.data.prompt);
      // setLoading(false);
    } catch (err) {
      // setError(err.message);
      // setLoading(false);
      console.error(err);
    }
  };

  const DisplayPrompts = () => {
    return (
      prompts.map((prompt) => {
        console.log("prompt:", prompt)
        return (
          <Button onClick={() => setPromptDetails(prompt)} variant='outlined'>
            Prompt: {prompt}
          </Button>
        )
      })
    )
  }

  const DisplayCurrentPromptDetails = () => {
    if (currentPromptDetails['Version']) {
      let promptDetails = currentPromptDetails['Version'][1]
      console.log("promptDetails")
      console.log(promptDetails)
      
      return (
        <>
          <Typography variant='h5' sx={{paddingBottom: '1vh'}}>
            Current Prompt: 
          </Typography>
          <Typography sx={{paddingBottom: '1vh'}}>
            <b>Name:</b> {promptDetails['Name']}
          </Typography>
          <Typography sx={{paddingBottom: '1vh'}}>
            <b>AI Definition:</b> {promptDetails['AI Definition']}
          </Typography>
          <Typography>
            <b>AI Initial Message:</b> {promptDetails['AI Initial Message']}
          </Typography>
        </>
      )
    }
  }

  const DisplayChat = () => {
    if (currentPromptDetails['Version'] && currentPromptDetails['Version']) {
      let promptDetails = currentPromptDetails['Version'][1]
      return(
        <ChatBox aiDefinition={promptDetails['AI Definition']} aiInitialMessage={promptDetails['AI Initial Message']}/>
      )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <Typography variant='h5'>
          Choose a prompt
        </Typography>
        <DisplayPrompts />

        <br/>
        <DisplayCurrentPromptDetails />

        <Typography variant="h2" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4vh"
        }}>
          AI Chat
        </Typography>
        <DisplayChat/>

      </main>

    </div>
  )
}
