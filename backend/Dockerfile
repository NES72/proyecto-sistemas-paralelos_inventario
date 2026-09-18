FROM node:22

WORKDIR /app

COPY . .

RUN chmod +x docker-entrypoint.sh \
    && rm -rf \
        node_modules/@rolldown/binding-linux-x64-musl \
        node_modules/lightningcss-linux-x64-musl \
        node_modules/@img/sharp-linuxmusl-x64 \
        node_modules/@img/sharp-libvips-linuxmusl-x64 \
        node_modules/@img/sharp-wasm32 \
        node_modules/@libsql/linux-x64-musl

RUN npx prisma contract emit

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]