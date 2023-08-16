# AWS Serverless Generative AI Quick Start Guide
In this guide we will provide a relatively simple example of how to host a generative AI application on AWS using the OpenAI API. I pulled most of this code from my other side project: [MyChefAI.com](MyChefAI.com), which is an AI recipe writer. 

There are two main pieces to this repo, a frontend and a backend. The frontend uses NextJS, the backend uses API API Gateway and Lambda deployed by AWS SAM. The Lambda utilizes the OpenAI API. 

NOTE: This repo is a work in progress. Right now it has only been tested running on the local machine, this hasn't been tested deployed yet. 

Features:
* OpenAI API key stored in AWS Secrets Manager
* Chat History maintained in UI
* UI will render markdown for better looking user interface
* Chat Prompt instructed to return travel itinerary in markdown

## Overview of the demo application
The application is an AI Travel agent who will attempt to write a trip itinerary for you. Once the LLM has gotten enough info, it will attempt to write the itinerary in markdown. The UI will render this markdown in the chat window into a nice looking format.

Here is how it looks:
![Demo image 1](docs/demo-image-1.png)
![Demo image 2](docs/demo-image-2.png)

# Backend - API
## Setup Steps

### Prereqs
1. Ensure you have AWS CLI configured with a profile
2. Install AWS SAM
3. Install Docker
4. Get an OpenAI API key

### Create Open AI API Key Secret
Run this bash command modified with your secret
```
aws secretsmanager create-secret --name /serverlessGenAiExample/openaiApiKey \
  --description "API Key for Open AI API" \
  --secret-string 'sk-********' 
```

## Test locally
Invoke AWS SAM API locally with an example event

```
cd backend

sam build && sam local invoke ChatFunction --event events/event.json
```

Startup te API with SAM to mock API Gateway and lambda locally

```
# NOTE: Use port 4000 because the local UI runs on port 3000
sam build && sam local start-api --port 4000
```

# FastAPI - Backend

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/chat_api/requirements.txt
```

# Frontend - UI
The frontend uses NextJS. 

*NOTE:* I have not yet written any deployment mechanism for the frontend, for now it only works on the local machine

### Prereqs
Ensure you have nodejs and npm installed

## Setup Steps
Leave your terminal with the backend up and running, open up a new terminal in the root of the repo to run the frontend

Install the needed deps for the frontend to run
```
cd frontend
npm install
```

## Run the frontend
```
npm run dev
```

You can now open the frontend at <http://localhost:3000>

# Now time to change up the prompt!

The initial prompt is maintained here in the ChatBot component of the frontend: [frontend/components/ChatBox.js](frontend/components/ChatBox.js) in the `initialMessages` variable. Change up the prompt however you wish. Maybe tell it to speak with a different accent, or tell the LLM it is a travel agent for Vienna, Virginia instead of Vienna, Austria.

There is no need to reload or rebuild. Simple make your alteration to the prompt, save the file, and you should see the localhost:3000 page will have refreshed, ready for you to start a new chat.

# Handling In-Context data (WIP)
Let's give the model access to data

Quote from OpenAI:

> Why search is better than fine-tuning  
GPT can learn knowledge in two ways:  
> 1) Via model weights (i.e., fine-tune the model on a training set)  
> 2) Via model inputs (i.e., insert the knowledge into an input message) <br><br>
Although fine-tuning can feel like the more natural option—training on data is how GPT learned all of its other knowledge, after all—we generally do not recommend it as a way to teach the model knowledge. Fine-tuning is better suited to teaching specialized tasks or styles, and is less reliable for factual recall.  

Source: https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb


## Need some help or have an idea for an improvement?
Please feel free to ask questions or make PRs.
