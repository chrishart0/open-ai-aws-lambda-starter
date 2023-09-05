import { useState, useEffect } from 'react';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Typography from '@mui/material/Typography';

import axios from 'axios';


// Components
import ChatBox from '../components/ChatBox';

// const url = https://77rhnjbnf3.execute-api.us-east-1.amazonaws.com/prod/
const baseURL = "http://localhost:4000";

export default function Home() {
  const [prompts, setPrompts] = useState([]);

  // const [lambdaResposne, setLambdaResposne] = useState([]);

  // Load data on component mount
  useEffect(() => {
    getPrompts()
  }, []);

  // console.log(lambdaResposne)

  const getPrompts = async () => {
    // setPrompts();


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

  const DisplayPrompts = () => {
    return (
    prompts.map((prompt) => {
      console.log("prompt:", prompt)
      return (
        <Typography>
          Prompt {prompt}
        </Typography>
      )
    })
    )

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Your AI Travel Agent</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Typography variant="h2" sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "5vh"
        }}>
          Your AI Travel Agent!
        </Typography>

        <Typography variant='h5'>
          Choose a prompt
        </Typography>

        <DisplayPrompts />
        <ChatBox />

      </main>

    </div>
  )
}
