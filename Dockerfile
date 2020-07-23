FROM node:12-stretch

ENV HOME=/home/app

COPY package.json $HOME/jbcrawler/

WORKDIR $HOME/jbcrawler

RUN npm install

COPY . $HOME/jbcrawler

EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]
