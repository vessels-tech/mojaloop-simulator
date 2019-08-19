FROM node:10.15.3-alpine
WORKDIR /opt/mowali-simulator

COPY package.json package-lock.json* .env /opt/mowali-simulator/
RUN npm install --production

COPY src /opt/mowali-simulator/src

EXPOSE 3000 3001
CMD ["npm", "run", "start"]
