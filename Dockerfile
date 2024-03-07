FROM node:20.4-alpine

WORKDIR /app

COPY . .

RUN npm install -g pm2 && npm install --production

EXPOSE 3000

# CMD ["npm", "run", "start"]
CMD ["pm2-runtime", "app.js"]