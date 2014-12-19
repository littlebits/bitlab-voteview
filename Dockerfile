FROM          node
MAINTAINER    Jason Kuhrt <jason.kuhrt@littlebits.cc>

ADD           . /usr/src/app
WORKDIR       /usr/src/app

RUN           npm install

CMD           ["npm", "start"]
