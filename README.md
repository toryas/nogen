# NoGeN

## ¿Que es nogen?

Nogen es una herramienta cli basada en [node-plop]( https://www.npmjs.com/package/node-plop ) para la generación de microservicios.

# Instalación

Para poder ocupar nogen desde cuelquier directorio se debe instalar **nogen** de forma global.

> npm i -g nogen

Luego el comando para de nogen es **ngn**

# Guía de uso

## Como crear un nuevo microservicio

Para la creaión de un nuevo artefacto ejecuta el comando:

    ngn new [nombre artefacto]

#### Ejemplo:

```
> ngn new users
```

El ejecutar el comando debe completar los datos que el asistente solicitara, los cuales son:

* Artifact Type ( API, BFF o Microservice )
* Description
* Author

Una vez completados los datos, se creara una carpeta con el nombre `users` en donde se encuentra el artefacto. Para saber más sobre la estrutura del artefacto y sus componentes ver apartado [descripción del artefacto](#itemdescripcionartefacto).

<a name="itemcreacionmodulos"></a>

## Como crear un módulo

Para la creación de un nuevo módulo ejecuta **dentro de la raíz del artefacto** el comando:

    ngn g m [nombre modulo]

Este comando genera los archivos del nuevo módulo en la ruta `[artefacto]/src/modules/[nombre modulo]` y agrega la ruta del nuevo módulo en el archivo ***route*** del servidor, de modo que todas las operaciones dentro del módulo tendran la miam ruta base.

#### Ejemplo:

Seguiremos con el ejemplo anterior usaremos el artefacto `users` y cearemos un módulo llamado **``validations``**.
Una vez dentro de la carpeta users ejecutaremos el comando `ngn g m validations`

```
> cd users
> ngn g m validations
```
Al terminar de ejecutar el comando se habra creado el módulo **`validations`** en la ruta `users/src/modules/validatinos`

```
src
├── modules
|    └── validations
|       ├── validations.codes.json
|       └── validations.module.js
|
```

Ahora todas las rutas de las operaciones dentro de este módulo tendran la siguiente forma:

> `http://[ip servidor:PORT]/[tipo artefacto]/[version]/users/validations/[operacion]`

Para ser mas especifico:

> `http://localhost:3000/microservice/v1/`**`users/validations/`**`...`


<a name="itemcreacionoperaciones"></a>

## Como agregar un operacion al microservicio

Existen 2 opciones para crear una operación:

### Crear operación dentro de un módulo

Para la creación de una nueva operacion dentro de un módulo ejecuta **dentro de la raíz del artefacto** el comando:

    ngn g c /[nombre módulo]/[nombre operacion]

Luego de ejecutar el comando deberas indicar de que tipo es tu operacíon, las opciones soportadas son: **GET, POST, PUT** y **DELETE**.

Este comando genera los archivos de la nueva operación en la ruta `[artefacto]/src/modules/[nombre módulo]/controllers/[nombre operacion]` ,agrega la ruta de la operacion al archivo de configuración del módulo y generara la estructura de cofigos para la operacion en el archivo de codigos de respuesta del módulo.

#### Ejemplo:

Siguiendo con el ejemplo del microservicio `users` crearemos una operacion llamada **`age`** dentro del módulo `validations`.

```
> cd users
> ngn g c /validations/age
```

Nos preguntara que tipo de operacion es y escojeremos en esta oportunidad **`POST`**.

Se creara la operacion **age** ( *`el nombre de operaciones se traasforma a kebab-case`* ) en la ruta `users/src/modules/validations/controllers/age.controller.js`

### Crear operación sin módulo

Para la creación de una nueva operacion sin un módulo ejecuta **dentro de la raíz del artefacto** el comando:

    ngn g c [nombre operación]

Luego de ejecutar el comando deberas indicar de que tipo es tu operacíon, las opciones soportadas son: **GET, POST, PUT** y **DELETE**.

Este comando genera los archivos de la nueva operación en la ruta `[artefacto]/src/api/controllers/[nombre operacion]` ,agrega la ruta de la operacion al archivo de rutas del servidor y generara la estructura de códigos de respuesta para la operacion en el archivo de codigos de respuesta de apis.

#### Ejemplo:

Siguiendo con el ejemplo del microservicio `users` crearemos una operacion llamada **`age`**.

```
> cd users
> ngn g c age
```

Nos preguntara que tipo de operacion es y escojeremos en esta oportunidad **`GET`**.

Se creara la operacion age ( *`el nombre de operaciones se traasforma a kebab-case`* ) en la ruta `users/src/api/controllers/age.controller.js`

```
src
└── api
    ├── controllers
    │   └── age.controller.js
    └── api.codes.json
```

Se agregara en el archivo `api.codes.json` la estructura de codigos de respuestas para la operacion `age` y se agregara la ruta de la operaion en el archivo `/src/core/server/router.js`.

La ruta de esta operacion sera:

> `http://localhost:3000/microservicio/v1/users/`**`age`**





<a name="itemdescripcionartefacto"></a>

# Descripción del Artefacto

## Estructura del artefacto

Esta es la estructura basica de un artefacto generado con el comando `bang new`


```
.
├── .babelrc
├── Makefile
├── README.md
├── jest.config.js
├── package.json
└── src
    ├── config
    │   ├── general-codes.json
    │   └── general.config.js
    ├── core
    │   ├── domain
    │   │   └── response.js
    │   ├── middleware
    │   │   ├── error.middleware.js
    │   ├── server
    │   │   ├── index.js
    │   │   └── router.js
    │   └── util
    │       ├── codes.util.js
    │       ├── config-validator.util.js
    │       ├── json.util.js
    │       ├── logger.util.js
    │       ├── request.util.js
    │       └── response.util.js
    ├── api (opcional)
    └── modules (opcional)
```

## Raíz de directorio

En la carpeta raíz del artefacto se encuentra una serie de archivos y directorios que se detallan acontinuacion.

* ***.babelrc*** : archivo de configuracion de [Babel](https://babeljs.io/).
* ***Makefile*** : archivo con instrucciones **make**, las instrucciones precargadas son :
    * run
    * build
    * install
    * unit-test
    * contract
    * coverage

* ***README .md*** : readme del proyecto.
* ***jest.config.js*** : archivo de configuración de [Jest](https://jestjs.io/).
* ***package.json*** : archivo de configuración del proyecto node.
* ***[src](#itemsrc)*** : carpeta con el codigo fuente del proyecto.

<a name="itemsrc"></a>

## Directorio SRC

Este directorio contiene el código fuente del proyecto y se estructura de la siguiente forma:

* ***config***: este directorio contiene las los archivos de configuración generales del proyecto, estos son:
    * **general-codes.json** :  códigos generales del proyecto, se usan para las respuestas genericas del proyecto. Para más informacion de este archivo y su configuración ver [condiguración de códigos de respuesta](#itemconfigcoderesponse).
    * **general.config.js** : configuración de variables de entorno del proyecto.Para más informacion de este archivo y su configuración ver [condiguración de variables de entorno](#itemconfigvariables).
* ***core*** : este directorio contiene el núcleo del artefacto, en su interior se encuentran utilitarios,middlewares y el server. Esta estructurada de la siguiente forma:
    * **domain** : directorio con objeto de dominion propio interno del core.
    * **middleware** : directorio con middlewares utilizados en el servidor. Para más informacion de los middlewares disponibles ver apartado [middlewares](#itemmiddlewares).
    * **server** : directorio que contiene archivo de servidor y manejador de rutas del servidor.
    * **util** : directorio con utilitarios. Para ás información de los utilitarios disponibles vew apratado [utilitarios](#itemutils).
* ***api (opcional)*** : este directorio contiene las operaciones del artefacto que no se agrupan dentro de ningun módulo. Este directorio es opcional debido a que el artefacto puede solo tener operaciones agrupadas en módulos. Para más informacion de creacion de operaciones ver apartado [creación de operaciones](#itemcreacionoperaciones).

* ***modules (opcional)*** :  este directorio contiene los modulos del artefacto, donde cada módulo agrupa operaciones. Este directorio es opcional debido a que el artefacto puede solo tener operaciones sin modulos (*apis*). Para mas informacion de la creacion de módulos ver el apartado [creacion de módulos](#itemcreacionmodulos).

# Configuraciones

## Configuración códigos de respuesta
<a name="itemconfigcoderesponse"></a>

El artefacto tiene 3 tipos de archivos donde se configurarn las respuestas, estos son:

* general-codes.json
* api.codes.json
* [modulo].codes.json

Estos 3 tipos de archivos se encuentran en diferentes directorios y se crean dependiendo de la necesidad, pero su estructura es la misma.

### Estructura de códigos de respuesta


```json
{
  "moduleName": "api",
  "moduleApi": [
    {
      "apiCode": "API",
      "codeGroup": [
        {
          "httpStatus": 200,
          "code": "0000",
          "message": "success"
        }
      ]
    }
  ]
}
```

| ***Elemento*** | ***Tipo de dato*** | ***Descripción*** |
|:-|:-:|:-|
|moduleName|String|Nobre del módulo|
|moduleApi|Array|Contiene el listado de operaciones y sus codigos|
|apiCode|String|Código de la operación|
|codeGroup|Array|Contiene los la tripleta de códigos **httpStatus,código y mensaje**|
|httpStatus|Numeric|Representa el status code de la respueta http|
|code|String|Representa el código de respuesta|
|message|String| Es el mensaje de la respuesta|


### Definición de archivos

* ***general-codes.json*** : Este archivo se encuentra en la ruta `[nombre artefacto]/src/config/` y contiene los codigos genericos del artefacto. 
* ***api.codes.json*** : Este archivo se encuentra en la ruta `[nombre artefacto]/src/api/` y se crea al momento de [crear operaciones](#itemcreacionoperaciones) que no estan agrupadas por un módulo y contiene todos los códigos de respuestas de dichas operaciones.
* ***[modulo].codes.json*** : Este archivo se crea al momento de [crear un módulo](#itemcreacionmodulos) y su nombre dependera del nombre del módulo creado, por ejemplo, si se crea un módulo co el comando `bang g m restricciones` se creara el archivo **restricciones.codes.json** y su ruta sera `[nombre artefacto]/src/modules/restricciones/restricciones.codes.json`. Este archivo contiene todos los códigos de respuestas de las operaciones agrupadas dentro de este módulo.


## Configuración variables
<a name="itemconfigvariables"></a>

Las variables del artefacto de configurarn en el archivo **general.config.js**. este archivo se encuentra en la ruta `[nombre artefacto]/src/config/`

Por defecto el artefacto se crea con una nica variable llamada `PORT` que apunta a la variable de entono `process.env.PORT`. esta variable se utiliza para identificar el PORT en el que escucha las peticiones el artefacto.

La configuracion general de variables se encuentran de la siguiente forma:

```javascript
export const GENERAL_CONFIG = {
  PORT: process.env.PORT
};
```

Se recomienda que si desea agregar nuevas variables, estas se agreguen a continuacion de la variable ***PORT***, de la siguiente forma:

```javascript
export const GENERAL_CONFIG = {
  PORT: process.env.PORT,
  VARIABLE:"VALOR"
};
```

En el caso que se quiera crear nuevo grupo de variables puede crear en el mismo archivo un nuevo conjunto de variables:

```javascript
export const GENERAL_CONFIG = {
  PORT: process.env.PORT
};

export const MYSQL_CONFIG = {
  USER: process.env.USER,
  PASSWORD:process.end.PASSWORD
};
```

Para utilizar alguna de las variables en el archivo **general.config.js** debe importar de la siguiente manera:

```javascript
import {[grupo de varaibles]} from '#config'
```

#### Ejemplo:

```javascript
import {GENERAL_CONFIG} from '#config'

console.log(GENERAL_CONFIG.PORT);
//Esto imprime el valos de process.env.PORT

```



## Middlewares
<a name="itemmiddlewares"></a>

Para utilizar alguno de los middleware disponible debe importarlo de la siguiente manera:

```javascript
import { nombre middleware} from '#middleware\[archivo middleware]'
```

#### Ejemplo:

```javascript
import {catchNotFoundError} from '#middleware\error.middleware'
```

A continuaion se listan los middleware disponibles y su funcionamiento.

| Nombre middleware | Ubicacion | Descripción |
| :-: | :-: | :- |
|catchGenericError| error.middleware.js| Este middleware captura los errores que no han sido controlados. Este middleware es implementado en el serivor por defecto.|
|catchNotFoundError| error.middleware.js | Este middleware captura las peticiones a rutas inexistentes en el artefacto, devolviendo un error 404. Este middleware es implementado en el servidor por defecto.|


## Utils
<a name="itemutils"></a>

Para utilizar alguno de los utilitarios disponible debe importarlo de la siguiente manera:

```javascript
import { nombre utilitario} from '#util\[archivo utilitario]'
```

#### Ejemplo:

```javascript
import {getLogger} from '#util\logger.util'
```

A continuacion se listan los utilitarios disponibles y su funcionamiento.

| Nombre Utilitario | Ubicacion | Descripción |
| :-: | :-: | :- |
|getCodeApi|codes.util.js|Retorna los codigos de un api|
|isFullDefined|json.util.js| Verifica que el JSON no tenga elementos sin definir ( en estado undefined).|
|elementType|json.util.js|Identifica el tipo de objecto del elemento: null,undefined,strgin, array, number, object.|
|getLogger|logger.util.js|Retorna un logger con el nombre especifico que se le da para loggear.|
|errorToOneLine|logger.util.js|Trasforma un error a un String de una linea.|
|responseBuilder|request.util.js|Crea una respuesta de salida para el artefacto.|