# disney
Api REST sobre el mundo de disney desarrollada con nodejs, usando patrón MVC. Utiliza jwt para autenticación de usuarios. Soporta PostgreSQL y MySQL. Documentado con Swagger.

## Construido con 🛠️

* [Express](https://expressjs.com/)
* [Node.js](https://nodejs.org/)
* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [MySQL](https://www.mysql.com/) 
* [PostgreSQL](https://www.postgresql.org/) 
* [Swagger](https://swagger.io/)

### Variables de entorno 🔧

* `DB_HOST` `DB_USER` `DB_PASSWORD`
* `DB_NAME_TEST` (base de datos para test)
* `DB_NAME` (base de datos principal)
* `DIALECT` (postgres o mysql)
* `GMAIL_SERVER_MAIL` (mail desde dónde se envían mensajes de bienvenida con nodemailer)
* `GMAIL_PASSWORD` 
* `PORT` (opcional)


## Ejecutando las pruebas ⚙️

* Crear dos bases de datos
* Crear .env y configurar las variables de entorno
* Instalar dependencias: `npm install`
* Ejecutar tests: `npm run test`

## Autor ✒️

**Milton Herrera Bauleo** - [mhbauleo](https://github.com/mhbauleo)

Proyecto en la nube: https://disney-api3.herokuapp.com