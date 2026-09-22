FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Copiar manifiestos de paquetes
COPY package*.json ./

# Instalar dependencias completas
RUN npm install

# Copiar el código fuente completo del Gemelo Digital
COPY . .

# Exponer el puerto del Gemelo Digital
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=development

# Lanzar el servidor con tsx
CMD ["npm", "run", "dev"]
