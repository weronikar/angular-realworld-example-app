#FROM cypress/base:16.14.2 err: qemu: uncaught target signal 5 (Trace/breakpoint trap) - core dumped https://github.com/docker/for-mac/issues/5831
FROM cypress/base:14.18.1

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --save-dev cypress
RUN $(npm bin)/cypress verify
RUN $(npm bin)/cypress run

RUN ["npm","run","cypress:e2e"]