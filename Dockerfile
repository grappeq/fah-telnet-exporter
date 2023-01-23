FROM node:18-alpine AS build

WORKDIR /usr/fah-telnet-exporter
COPY package.json package-lock.json tsconfig.json tsconfig.build.json .mocharc.cjs ./
COPY src ./src
RUN npm install
RUN npm run test
RUN npm run build


FROM node:18-alpine

WORKDIR /usr/fah-telnet-exporter
COPY package.json package-lock.json ./
RUN npm install --production
COPY --from=build /usr/fah-telnet-exporter/build ./build
RUN chmod u+x /usr/fah-telnet-exporter/build/www.js

EXPOSE 3000

ENTRYPOINT ["/usr/fah-telnet-exporter/build/www.js"]