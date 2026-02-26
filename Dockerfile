FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js