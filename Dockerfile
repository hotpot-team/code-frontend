FROM nginx:alpine

ADD prod/ /usr/share/nginx/html
ADD default.conf /etc/nginx/conf.d
