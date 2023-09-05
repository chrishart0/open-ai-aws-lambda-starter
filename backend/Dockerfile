# Use an official lightweight Python image.
# We chose a slim-buster image to keep the image size small, but you can choose another if needed.
FROM python:3.10-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run on container start, reload API when code change detected
CMD ["uvicorn", "fast_api:app", "--host", "0.0.0.0", "--port", "4000", "--reload"]

