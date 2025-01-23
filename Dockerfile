FROM nginx:alpine

RUN mkdir /data

COPY dist/ /data/venus-admin

COPY venus-admin.conf /etc/nginx/conf.d/venus-admin.conf

CMD ["nginx", "-g", "daemon off;"]
