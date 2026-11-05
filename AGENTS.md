# complements

Utilidades sueltas, no un servicio del ecosistema. Hay un esqueleto de Create React App y, al lado, scripts de un solo uso contra Mongo y Excel.

## Qué ejecutar

| Comando | Qué hace |
| --- | --- |
| `npm start` | React en el puerto 3000 (`src/App.js`, `src/components/`) |
| `npm run queecmd` | `node src/queecmd/index.js` |

El trabajo real está en scripts, no en la UI:

| Carpeta | Contenido |
| --- | --- |
| `src/queecmd/` | cruce de conductores y vehículos, expedientes IMA, limpieza de talkers, conexiones Mongo |
| `src/scripts/` | diagnóstico e índices de Mongo |
| `src/ExternalData/` | Excel y JSON de entrada y de resultado |

## Al localizar un fallo

El fallo es de un script concreto. Ábrelo y sigue el fichero de `ExternalData/` que lee. No hay API, ni Kafka, ni front de operador.

## Entorno

El script se lanza con `node src/queecmd/<fichero>.js` o `npm run queecmd` para `index.js`. `npm start` es el React de ejemplo, en el puerto 3000, y no es Tower ni concesiones. No uses pnpm ni Turbo.

## Tests

`npm test` abre el runner interactivo de Create React App y se queda esperando: no lo uses para comprobar un script. No hay `.github/workflows`.

Comprueba el script leyendo el Excel o JSON de `src/ExternalData/` que consume y el fichero que escribe.

## Antes de dar el cambio por cerrado

El script termina y el fichero de salida cuadra con la entrada. No copies cadenas de conexión que haya dentro de los scripts. No las muevas a este archivo ni a un commit. `node_modules/` no se edita.
