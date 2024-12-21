# Build Stage
FROM nginx:alpine as production-build-stage

COPY ./dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]