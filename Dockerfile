FROM node:10.15.1-alpine AS builder

COPY . /git-history

WORKDIR /git-history

RUN npm install -g yarn \
    && yarn install \
    && yarn build

FROM nginx:1.14.2-alpine

LABEL maintainer="mritd <mritd1234@gmail.com>"

RUN apk upgrade --update \
    && rm -rf /etc/nginx/conf.d/default.conf \
        /usr/share/nginx/html \
        /var/cache/apk/*

COPY nginx.react.default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /git-history/build /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
