FROM nginx:alpine

COPY ./compodocs /usr/share/nginx/html
COPY ./operations/storydocs.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/cache/nginx/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /etc/nginx/conf.d && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /usr/share/nginx/html

USER nginx