FROM nginx:alpine

RUN apk add --no-cache bash && apk add --no-cache zip

COPY ./dist/apps/de-elements /usr/share/nginx/html
COPY ./operations/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./operations/context.sh /usr/share/nginx/dynamiccontext/context.sh

ENV ENABLE_CVV=true

ENV MODE=prod

WORKDIR /var/cache/nginx/

RUN touch /var/run/nginx.pid && \
  chmod +x /usr/share/nginx/dynamiccontext/context.sh && \
  chown -R nginx:nginx /usr/share/nginx/dynamiccontext && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /etc/nginx/conf.d && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /usr/share/nginx/html

USER nginx

ENTRYPOINT /usr/share/nginx/dynamiccontext/context.sh && envsubst < /usr/share/nginx/html/assets/settings.template.js > /usr/share/nginx/html/assets/settings.js && envsubst < /usr/share/nginx/html/assets/elements.settings.template.js > /usr/share/nginx/html/assets/elements.settings.js &&  exec nginx -g 'daemon off;'