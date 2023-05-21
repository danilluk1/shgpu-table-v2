FROM node:18-alpine

RUN apk add --no-cache bash

RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
  echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
  apk add doppler


WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install

COPY . /app
RUN pnpm run build

COPY docker.sh /
RUN chmod +x /docker.sh
CMD ["doppler", "run", "--", "printenv"]
ENTRYPOINT ["/docker.sh"]