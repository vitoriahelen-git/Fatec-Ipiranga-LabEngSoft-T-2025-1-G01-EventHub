FROM node
WORKDIR /user/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]