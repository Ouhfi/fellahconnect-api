FROM node:20-alpine

WORKDIR /app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the API port
EXPOSE 3000

# Run the dev command defined in package.json
CMD ["npm", "run", "dev"]
