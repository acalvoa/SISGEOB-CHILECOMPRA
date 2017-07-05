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

- Mover el archivo `Properties/config.properties` a la ruta especificada en el archivo `Properties.java` para que la aplicación tome los parametros de inicialización
- Configurar la base de datos en el archivo config.properties

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

### Compilar

```bash
$ ant compile
$ ll build
total 4,0K
drwxrwxr-x 4 sgonzalezvi sgonzalezvi 4,0K jul  5 17:15 classes

```

### Distribuir

```bash
$ ant dist
$ ll dist 
total 63M
-rw-rw-r-- 1 sgonzalezvi sgonzalezvi 63M jul  5 17:34 sisgeob-chilecompra.war
```

### Distribuir como EAR

```bash
$ ant dist-ear
$ ll dist 
total 63M
-rw-rw-r-- 1 sgonzalezvi sgonzalezvi 63M jul  5 17:35 sisgeob-chilecompra.ear
```
