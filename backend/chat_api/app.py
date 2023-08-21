import boto3
import logging
import logging.config
import openai

# Configure logging
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "uvicorn.error": {
            "level": "INFO",
        },
        "uvicorn.access": {
            "level": "INFO",
            "handlers": ["console"],
        },
    },
}

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("uvicorn.info")

# Export logger as a function
def get_logger():
    """
    :return: Logger object
    Example of how to import
    from app import get_logger
    logger = get_logger()
    """
    return logger


logger.info("Initializing the things which need that to be prepared")


# Function to retrieve secret value (OpenAI API key) from AWS Secrets Manager
def get_secret_value(secret_name):
    secretsmanager = boto3.client('secretsmanager')
    openai_api_key_secret = '/serverlessGenAiExample/openaiApiKey'
    try:
        # Fetch parameter details from AWS Secrets Manager
        secret_response = secretsmanager.get_secret_value(SecretId=secret_name) 
        # Extract the value of the parameter
        secret_value = secret_response['SecretString']
        return secret_value
    except Exception as e:
        # Log error if any exception occurs
        logger.error(e)
        logger.error(f"Error in getting secret value: {str(e)}")
        # Propagate the exception further
        raise e
    
def get_openai_api_key():
    # return get_secret_value(openai_api_key_secret)
    # Get local key
    with open('openai_api_key.txt', 'r') as file:
        api_key = file.read().strip()
    return api_key
    

def call_openai_api(messages, api_key):
    """
    :param message: Message to send to OpenAI API
    :param api_key: OpenAI API key
    :return: Response from OpenAI API

    This function calls the OpenAI API with the provided message and returns the response.
    """

    try:
        # Set OpenAI API key
        openai.api_key = api_key
        
        # Log start of API call
        logger.info("Calling OpenAI API")

        # Call OpenAI API with provided messages and model
        # https://platform.openai.com/docs/guides/gpt/chat-completions-api
        print("")
        print("----------")
        print(messages)

        # messages=[
        #     {"role": "system", "content": "You are travel agent with years of experience who specializes in central Europe. You are a posh English person who is slightly pretentious but still friendly. You are speaking with me, a client who has come to you with help for planning out my trip. You should ask me as many questions as you need and help me to build out a trip itinerary and answer any questions I have."},
        #     {"role": "user", "content": "I am going to Vienna."},
        #     {
        #     "role": "assistant",
        #     "content": "Ah, Vienna! A splendid choice my dear traveler. The city of classical music, splendid architecture, and exquisite coffeehouses. Pray, do tell me, how long do you plan to spend in Vienna and what are your interests while visiting this enchanting city?"
        #     },
        #     {"role": "user", "content": "1 week"},
        #     {
        #         "role": "assistant",
        #         "content": "Very well, a week in Vienna should allow you ample time to explore the city's cultural treasures. Now, let me inquire further about your interests, as Vienna offers a wide range of experiences.\n\nAre you fond of classical music? If so, I highly recommend attending a performance at the Vienna State Opera or the Musikverein, where you can witness the mastery of renowned orchestras and talented musicians. Additionally, you may want to visit the Mozarthaus, the former residence of Wolfgang Amadeus Mozart himself.\n\nDo you have an appreciation for art? Vienna boasts an impressive array of museums and galleries. The Belvedere Palace houses an extensive collection of Austrian art, including works by Gustav Klimt. The Albertina Museum is another gem, with its remarkable collection of prints and drawings.\n\nAre you intrigued by history? A visit to the Hofburg Palace, the former imperial residence, is a must. You can also explore the Schönbrunn Palace, which was once the summer residence of the Habsburgs and offers stunning panoramic views of the city.\n\nWould you like to delve into Viennese cuisine and culture? I suggest indulging in a traditional Viennese coffeehouse experience, where you can savor exquisite pastries like Sachertorte. You may also wish to explore the Naschmarkt, a bustling market offering a variety of culinary delights.\n\nFinally, have you considered taking day trips from Vienna? Nearby, you have the option to visit picturesque towns such as Salzburg or the stunning Wachau Valley, which is renowned for its vineyards and charming villages.\n\nPlease do let me know which of these activities pique your interest, and I shall gladly assist you in crafting an itinerary tailored to your preferences."
        #     },
        #     {"role": "user", "content": "Architecture and music are what I am looking for. I am also open to some day trips, such as to Hallstatt and Salzburg."},
        # ]
        # print("")
        # print("----------")
        # print(messages)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
            )
        
        # print("Response: ", response)
        message = response.choices[0].message
        tokens_used = response.usage.total_tokens

        # tokens_used = completion.usage.total_tokens
        logger.info(f"Tokens used: {tokens_used}")


        # Extract the content of the response message and tokens consumed
        # return completion.choices[0].message.content
        return message, tokens_used
    
    except Exception as e:
        # Log error if any exception occurs
        logger.error(e)
        logger.error(f"Error in calling OpenAI API: {str(e)}")
        # Propagate the exception further
        raise e
