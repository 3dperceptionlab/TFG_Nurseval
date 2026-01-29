# tfg_bsempere: nursEval
Proyecto web para la evaluación de procedimientos clínicos de estudiantes de enfermería mediante las Miscrosoft Hololens 2.

## Resumen
La formación práctica es una parte fundamental en los estudios de enfermería, ya que permite a los futuros profesionales adquirir las habilidades necesarias para desenvolverse en entornos clínicos reales. Sin embargo, la evaluación de procedimientos prácticos —como los distintos protocolos de vendaje— sigue siendo un proceso complejo y, en muchos casos, subjetivo.

Actualmente, esta evaluación depende principalmente de la observación directa del profesorado, lo que puede generar variabilidad en los criterios de valoración y dificulta la obtención de un registro detallado del desempeño de cada estudiante. Además, no siempre es posible proporcionar una retroalimentación completa ni analizar la evolución del alumnado a lo largo del tiempo.

Ante esta problemática surge **nursEval**, un sistema que utiliza las Microsoft HoloLens 2 para capturar información relevante durante la ejecución de un protocolo clínico y presentarla de forma clara y estructurada para su análisis posterior.

## Objetivos
- Desarrollar una aplicación de realidad mixta para Microsoft HoloLens 2 que permita capturar información relevante durante la ejecución de procedimientos clínicos.
- Aplicar técnicas de seguimiento de manos y de la mirada mediante Unreal Engine para el análisis del desempeño del estudiante.
- Proporcionar una plataforma web con contenido teórico que describa los pasos de cada protocolo clínico.
- Visualizar de forma clara la ejecución del procedimiento mediante una línea temporal que muestre errores y posibles mejoras.
- Facilitar una evaluación objetiva y una retroalimentación detallada para estudiantes y profesores.
- Integrar la aplicación de realidad mixta con una plataforma web para el almacenamiento y visualización de los datos.
  
## Características

## Tecnologías empleadas
- Microsoft HoloLens 2
- Unreal Engine 4.27
- Angular 20 (TypeScript)
- Tailwind CSS
- Spring Boot 4 (Java 21)
- MongoDB (NoSQL)
- Apache Maven

## Instalación
### Requisitos
Para el correcto despliegue del proyecto, es necesario contar con:
- Java JDK: https://jdk.java.net/
- Node.js y npm: https://nodejs.org/es
- Angular CLI:
  ```bash
  npm install -g @angular/cli
  ```
- Apache Maven: https://maven.apache.org/download.cgi
- MongoDB: https://www.mongodb.com/try/download/community
- Git: https://git-scm.com/install/

### 1. Clonar repositorio
  ```bash
   git clone https://github.com/3dperceptionlab/tfg_bsempere.git
  ```
### 2. Backend
2.1 Acceder al directorio backend:
   ```bash
   cd backend
  ```
2.2 Compilar y ejecutar:
  * **Opción A**:
  ```bash
  mvn spring-boot:run
  ```
  * **Opción B**: emplear herramientas integradas en el IDE o extensión de VSCode como Spring Boot Dashboard.
 2.3 Arrancar mongoDB:
    * **Opción A**:
  ```bash
  mongod
  ```
  * **Opción B**: usar MongoDB Compass o MongoDB Shell
### 3. Frontend
3.1 Acceder al directorio frontend:
   ```bash
   cd frontend
  ```
3.2 Instalar dependencias:
  ```bash
  npm install
  ```
3.2 Compilar y ejecutar:
 ```bash
  ng serve
  ```
