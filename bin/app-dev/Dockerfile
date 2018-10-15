# @see:
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/nodejs/docker-node/blob/master/README.md#how-to-use-this-image
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
FROM node:8-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./.babelrc .
COPY ./webpack.config.js .

EXPOSE 3000
CMD ["npm", "run", "dev"]