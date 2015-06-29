FROM alpine:3.2
RUN apk add --update nginx && rm -rf /var/cache/apk/*
RUN mkdir -p /tmp/nginx/client-body

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

#COPY ssl/nginx.crt /etc/nginx/ssl/nginx.crt
#COPY ssl/nginx.key /etc/nginx/ssl/nginx.key
#COPY app /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
