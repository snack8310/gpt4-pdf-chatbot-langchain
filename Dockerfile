FROM node:18
WORKDIR /app
COPY ./ /app
RUN touch .env

RUN yarn install
EXPOSE 5000


CMD ["sh","/app/start.sh"]