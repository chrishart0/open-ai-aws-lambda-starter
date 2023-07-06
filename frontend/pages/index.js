import { useState, useEffect } from 'react';

import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import axios from 'axios';


// Components
import ChatBox from '../components/ChatBox';

// const url = https://77rhnjbnf3.execute-api.us-east-1.amazonaws.com/prod/
const url = "http://localhost:3000/chat"

export default function Home() {

  // const [lambdaResposne, setLambdaResposne] = useState([]);

  // // Load data on component mount
  // useEffect(() => {
  //   handleSearch()
  // }, []);

  // console.log(lambdaResposne)


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
        }}>
          Your AI Travel Agent!
        </Typography>
        <ChatBox />

      </main>

    </div>
  )
}
