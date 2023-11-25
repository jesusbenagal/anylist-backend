<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Dev

1. Clonar el proyecto
2. Copiar el ```.env.template``` y renombrarlo a ```.env```
3. Ejecutar 
```
npm install
```
4. Levantar la imagen de Docker
```
docker-compose up -d
```
5. Levantar el backend de Nest
```
npm run start:dev
```
6. Visitar el sitio
```
http://localhost:3000/graphql
```

7. Ejecutar la __"mutation"__ executeSeed, para llenar la base de datos con la información