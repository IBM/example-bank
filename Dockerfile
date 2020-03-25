FROM docker.io/library/node:12.16.1-alpine

ENV NODE_ENV production
ENV PORT 8080

RUN mkdir /app
COPY public /app/public
COPY app.js /app/
COPY package.json /app/package.json
COPY routes /app/routes
WORKDIR /app
RUN npm install

CMD ["node", "app.js"]

