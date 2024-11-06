# Base Image for the Backend Node.js Application Docker image
FROM --platform=linux/amd64 node:18-alpine
# Nodememon for monitoring and watching the Backend Node.js Application container
RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]