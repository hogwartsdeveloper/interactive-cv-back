FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

RUN npx prisma generate && npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]