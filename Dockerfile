FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]
