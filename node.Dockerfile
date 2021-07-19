# pull official base image
FROM node:14-alpine as base

#init client react
FROM base as client
# set the working direction
WORKDIR /app/client
# add `/app/client/node_modules/.bin` to $PATH
ENV PATH /app/client/node_modules/.bin:$PATH
# install app dependencies
COPY ./front/client/package.json ./
COPY ./front/client/package-lock.json ./
RUN npm install
# add app
COPY ./front/client ./
EXPOSE 5000
# start app
CMD ["npm", "start"]

#init client react
FROM base as admin
# set the working direction
WORKDIR /app/admin
# add `/app/admin/node_modules/.bin` to $PATH
ENV PATH /app/admin/node_modules/.bin:$PATH
# install app dependencies
COPY ./front/admin/package.json ./
COPY ./front/admin/package-lock.json ./
RUN npm install
# add app
COPY ./front/admin ./
EXPOSE 5001
# start app
CMD ["npm", "start"]