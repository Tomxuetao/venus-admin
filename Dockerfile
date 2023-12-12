FROM nginx:alpine

RUN mkdir /data

COPY dist/ /data/venus-admin

COPY default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
