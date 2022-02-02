
## Yukon Timber Harvest Reporting

- What is this project?
- How does it work?
- Who will use this project?
- What is the goal of this project?

### Overview

This application allow timber harvesters to report their harvested quantity 
through an online application which can then be approved through the internal 
Forestar Apex Application

###Directory Structure

The project contains three modules:
- `/client` Front-end application written in React
- `/sever` Back-end API in a ExpressJS sever
- `/_docker` Dcoker specific files for docker-compose

###Environment Variables

Each module has their own `.env` file as needed. `.env.base` files give an idea of the required variables.

###Development

To run the application in a development environment. 
Checkout the repo and create .env files with appropriate values for the dev setup. 
- `nginx` At the root level run `docker-compose up`
- `/client` In this directory run `npm i` and then `npm start`
- `/sever` In this directory run `npm i` and then `npm run start-watch`

###Test

To build and run a test environment. Checkout the repo and create `.env` files with appropriate values for the test setup.

####To build client image

- In the `/client` directory run:
  1. `npm i`
  2. `npm run build-css`
  3. `nom run build`
  4. `docker build -t timber-client .`
  5. 
####To build server image
  
- In the `/server` directory run:
    1. `npm i`
    2. `nom run build`
    3. `docker build -t timber-api .`
    4. 
####To run images and nginx in front of them
    
At the root level run `docker-compose -f docker-compose-test.yml up`