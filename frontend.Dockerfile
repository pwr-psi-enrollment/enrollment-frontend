FROM node:12
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install http-server -g

COPY . .

CMD [ "http-server", "--port", "8081" ]