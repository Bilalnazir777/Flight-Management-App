Project Setup and Run Guide
This project, the Flight Management App, uses Docker to set up the required services, which include Redis, Kafka, MongoDB, and Zookeeper. It also runs a Node.js server to handle the business logic. Follow the steps below to get everything up and running.

Prerequisites
Ensure you have the following installed:

Docker: Install Docker
Node.js: Install Node.js
Getting Started

1. Clone the Repository
   Clone the project repository using the command:

```bash
Copy code
git clone <repository_url>
```

2. Set Up Environment Variables
1. In the devops folder, create a .env file in the root directory and populate it with environment variables from sample.env.
1. In the server folder, create a .env file in the root directory and populate it with environment variables from sample.env.
1. In the client folder, create a .env file in the root directory and populate it with environment variables from sample.env.
1. Start the DevOps Services
   First, navigate to the devops folder:

```bash
Copy code
cd devops
```

Then, run the following command in a Bash terminal (ensure Docker Desktop is installed and running on Windows users):

```bash
Copy code
docker compose up -d
```

This will start the necessary services in the background, and you should see the following containers running:

1.mongodb

2.mongo-express

3.redis

4.kafka

5.zookeeper

Set Up & Run the Server
Once the DevOps containers are up and running, navigate to the server directory:

```bash
Copy code
cd server
```

Install the necessary dependencies for the server:

```bash
Copy code
npm install
```

Now, start the server:

```bash
Copy code
npm start
```

5. Set Up & Run the Socket Service
   After ensuring that the server is running, navigate to the socket folder inside the infrastructure directory:

```bash
Copy code
cd server/infrastructure/socket
```

Install the WebSocket module:

```bash
Copy code
npm install ws
```

Then, run the WebSocket service to establish a connection with Kafka:

```bash
Copy code
node websocket.js
```

6. Set Up & Run the Client
   Once the backend services are up and running, navigate to the client directory to view the dashboard:

```bash
Copy code
cd client
```

Install the required dependencies for the client:

```bash
Copy code
npm install
```

Finally, start the client application:

```bash
Copy code
npm run client
```

This will provide you with a URL for the dashboard, which you can open by holding Ctrl (or Cmd on macOS) and clicking the link.

Summary
Clone the repository and set up environment variables in the respective .env files.
Start the DevOps containers using Docker Compose to set up Redis, Kafka, MongoDB, and Zookeeper.
Install server dependencies and start the backend server.
Install the WebSocket module and run the socket service to connect with Kafka.
Install client dependencies and start the front-end client to access the dashboard.
With these steps completed, you should have the full flight management application running on your local machine.
