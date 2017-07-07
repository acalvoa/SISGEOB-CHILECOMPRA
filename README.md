# PASARELA - SISGEOB CHILECOMPRA

## Carcateristicas

- Implementa ORM basico
- Implementa Websockets como metodo de comunicación
- Disponibiliza una API HTTP mediada por controllers

## Dependencias

- Oracle Weblogic 11g

## Eclipse plugins

- Oracle Server Tools

## Configuración

En el proceso de creación del paquete distribuible (*Apache Ant*) se generarán dos archivos de configuración. Las propiedades de estos archivos serán obtenidas de los archivos de configuración definidos para cada ambiente:
  - `Properties/develop.properties`
  - `Properties/testing.properties`
  - `Properties/production.properties`

Los archivos generados por `Ant` son:
  - `CHILECOMPRA/app/config/properties.json` para las properties de front-end
  - `Properties/config.properties` para las properties del back-end

Cabe destacar que el archivo `Properties/config.properties` debe ser copiado en la ruta definida en `PATH_CONFIG_FILE` del archivo de configuración de cada ambiente y el archivo `CHILECOMPRA/app/config/properties.json` irá en el .war.

Por defecto *Apache Ant* generará los archivos de configuración para el ambiente de desarrollo (develop). Para especificar el ambiente debemos enviarlo por el parámetro `env`. Esto será ejemplificado en la sección [Distribuir](#Distribuir).

## Desarrollo en Eclipse

- Crear un Proyecto EAR que contenga el proyecto
- Crear un Servidor Weblogic 11g
- Agregar el proyecto EAR al servidor creado
- Enjoy!

## Compilación y distribución

Para la compilación y distribución se utiliza la herramienta [Apache Ant](http://ant.apache.org/).

### Instalar Apache Ant

- Linux
   
   ```bash
   $ sudo apt-get install ant
   ```

### Uso

```bash
$ ant -p
Buildfile: /home/sgonzalezvi/git/sisgeob-chilecompra/build.xml

Main targets:

 clean     Clean up
 compile   Compile the source
 dist      Generate the distribution
 dist-ear  Generate the EAR distribution
Default target: dist

```

### Distribuir

#### Desarrollo

```bash
$ ant dist
$ ll dist 
total 63M
-rw-rw-r-- 1 sgonzalezvi sgonzalezvi 63M jul  5 17:34 sisgeob-chilecompra.war
```

#### Testing

```bash
$ ant dist -Denv=testing
$ ll dist 
total 63M
-rw-rw-r-- 1 sgonzalezvi sgonzalezvi 63M jul  5 17:34 sisgeob-chilecompra.war
```

#### Producción

```bash
$ ant dist -Denv=production
$ ll dist 
total 63M
-rw-rw-r-- 1 sgonzalezvi sgonzalezvi 63M jul  5 17:34 sisgeob-chilecompra.war
```

#### EAR

```bash
$ ant dist-ear
$ ll dist 
total 63M
-rw-rw-r-- 1 sgonzalezvi sgonzalezvi 63M jul  5 17:35 sisgeob-chilecompra.ear
```
