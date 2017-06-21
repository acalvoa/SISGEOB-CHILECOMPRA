# PASARELA - SISGEOB CHILECOMPRA

## Dependencias

- Oracle Weblogic 11g

## Eclipse plugins

- Oracle Server Tools

## Instrucciones para levantar el ambiente de desarrollo

- Crear un Proyecto EAR que contenga el proyecto
- Crear un Servidor Weblogic 11g
- Agregar el proyecto EAR al servidor creado
- Mover el Archivo Properties/config.properties a la ruta especificada en el archivo Properties.java para que la aplicación tome los parametros de inicialización
- Configurar la base de datos en el archivo config.properties
- Enjoy

## Carcateristicas

- Implementa ORM basico
- Implementa Websockets como metodo de comunicación
- Disponibiliza una API HTTP mediada por controllers
