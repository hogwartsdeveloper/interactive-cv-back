FROM node

WORKDIR /app

COPY package.json /app

RUN npm install && npx prisma migrate dev --name init && npm run build

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]