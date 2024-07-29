FROM nginx:alpine

RUN apk add --no-cache bash

COPY ./dist/apps/de-oem /usr/share/nginx/html
COPY ./operations/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./operations/context.sh /usr/share/nginx/dynamiccontext/context.sh

ENV ENABLE_CVV=true

ENV MODE=prod

ENV ENABLE_CMS_CONTENT=false

WORKDIR /var/cache/nginx/

RUN touch /var/run/nginx.pid && \
  chmod +x /usr/share/nginx/dynamiccontext/context.sh && \
  chown -R nginx:nginx /usr/share/nginx/dynamiccontext && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /etc/nginx/conf.d && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /usr/share/nginx/html

USER nginx

ENV CONTEXT=oem

ENTRYPOINT /usr/share/nginx/dynamiccontext/context.sh && envsubst < /usr/share/nginx/html/assets/settings.template.js > /usr/share/nginx/html/assets/settings.js &&  exec nginx -g 'daemon off;'
