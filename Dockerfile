FROM node:8
#RUN mkdir -p /usr/SOURCES/rest-api
WORKDIR /usr/SOURCES/rest-api
COPY package.json /usr/SOURCES/rest-api
RUN npm install --quiet
COPY . /usr/SOURCES/rest-api
RUN mkdir /usr/SOURCES/rest-api/logs
RUN touch ./logs/error.log
RUN mkdir /usr/SOURCES/rest-api/upload
EXPOSE 3000
EXPOSE 3001
#CMD ["npm", "start"]
