# Dom's Dental Backend Service

For documentation: <a href='https://docs.google.com/document/d/1kuxg5S8xTBo_8tzfEUvX9ZkATqh2mjzJO5ewUWe_cDs/edit?usp=sharing'> Documentation File </a>
Enjoy your stay!

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)

---

## Description

This application provides backend services and support for the online scheduling system of its Dental Services frontend application.

## Features

- Serves the frontend application with register, login features with JWT.
- Serves data for the appointments booked, and available dentists

## Technologies

- **Backend:** Node.js, Express, DynamoDB
- **Other services:** Docker, Kubernetes, Nodemon, cors, bcrypt, jwt

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project
   ```
2. **Install Dependencies**
   ```
   npm install
   ```
3. **Set up environmental variables**
   Request environment variables to the repository owner.

   ```
   PORT=8080
   AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY=YOUR_ACCESS_KEY
   JWT_SECRET=YOUR_JWT_SECRET
   ```

4. **Run the Application**
   ````npm start - to run project
   npm run dev - to run on development on nodemon```
   ````
