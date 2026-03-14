FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DOCKER_BUILD=true
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]