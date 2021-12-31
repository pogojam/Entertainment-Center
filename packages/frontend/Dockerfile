FROM balenalib/asus-tinker-board-s-alpine-node
WORKDIR ./app
COPY package.json ./ 
COPY yarn.lock ./
RUN yarn  
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install -g react-script
ENV API_HOST=http://localhost
COPY . .

CMD ["yarn","start"]
