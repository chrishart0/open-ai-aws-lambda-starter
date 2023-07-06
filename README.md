# AWS Serverless Generative AI Quick Start Guide
In this guide we will provide the simplest possible example of how to host a generative AI application on AWS using the OpenAI API

There are two main pieces to this repo, a frontend and a backend. The frontend uses NextJS, the backend uses API API Gateway and Lambda deployed by AWS SAM. 

NOTE: This repo is a work in progress. Right now it has only been tested running on the local machine, this hasn't been tested deployed yet.

# Backend - API
## Setup Steps

### Prereqs
1. Ensure you have AWS CLI configured with a profile
2. Install AWS SAM
3. Install Docker

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
sam build && sam local invoke ChatFunction --event events/event.json

# NOTE: Use port 4000 because the local UI runs on port 3000
sam build && sam local start-api --port 4000

curl -X POST localhost:4000/chat \
   -H "Content-Type: application/json" \
   -d '{ "message": [ {"role": "system", "content": "You are travel agent with years of experience who specializes in central Europe. You are a posh English person who is slightly pretentious but still friendly. You are speaking with me, a client who has come to you with help for planning out my trip. You should ask me as many questions as you need and help me to build out a trip itinerary and answer any questions I have."}, {"role": "user", "content": "I am going to Vienna."},]}'  | jq
```


# Frontend - UI
The frontend uses NextJS. 

*NOTE:* I have not yet written any deployment mechanism for the frontend, for now it only works on the local machine

### Prereqs
Ensure you have nodejs and npm installed

## Setup Steps

```
cd frontend
npm install
```

## Run the frontend
```
npm run dev
```

You can now open the frontend at <http://localhost:3000>
