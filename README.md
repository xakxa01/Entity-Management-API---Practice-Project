---

# API de Gestión de Entidades

Esta API permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre entidades. Está construida con **Node.js**, **Express** y **SQLite** para el manejo de la base de datos, y utiliza **Zod** para la validación de datos.

## Características

- **Obtener todas las entidades** con paginación.
- **Crear una nueva entidad** validando los datos de entrada.
- **Obtener una entidad** específica mediante su `entity_id`.
- **Actualizar una entidad** existente de forma parcial.
- **Eliminar una entidad** por su `entity_id`.

## Requisitos

- **Node.js** v22 o superior.
- **SQLite** (se utiliza a través de la librería que maneja la conexión en `database.ts`).

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/xakxa01/Entity-Management-API---Practice-Project.git
   cd Entity-Management-API---Practice-Project
   ```

2. **Instala las dependencias:**

   Puedes utilizar el gestor de paquetes que prefieras:

   - Con **npm**:
     ```bash
     npm install
     ```
   - Con **pnpm**:
     ```bash
     pnpm install
     ```
   - Con **yarn**:
     ```bash
     yarn
     ```

3. **Configura la base de datos:**

   Asegúrate de que el archivo y la configuración en `database.ts` estén correctamente definidos según tu entorno.

## Uso

Para iniciar la API, ejecuta:

```bash
npm start
```

O, si deseas utilizar el modo de desarrollo con reinicio automático:

```bash
npm run dev
```

La API se ejecutará por defecto en `http://localhost:3000` (o en el puerto que hayas configurado).

## Endpoints

### 1. Obtener todas las entidades

- **URL:** `/api/entities`
- **Método:** `GET`
- **Query Params (Opcionales):**
  - `page`: Número de página (por defecto 1).
  - `limit`: Cantidad de entidades por página (por defecto 10).

**Respuesta exitosa (200):**

```json
{
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10,
  "data": [
    {
      "entity_id": "valor",
      "client_id": "valor",
      "type": "valor",
      "data": { /* objeto JSON con datos según el tipo */ },
      "last_updated": "fecha",
      "last_reported": "fecha",
      "last_changed": "fecha"
    }
    // ...
  ]
}
```

### 2. Crear una nueva entidad

- **URL:** `/api/entities`
- **Método:** `POST`
- **Body:** Objeto JSON con la siguiente estructura:

  ```json
  {
    "entity_id": "string",
    "client_id": "string",
    "type": "string",
    "data": { /* objeto JSON con datos según el tipo */ },
    "last_updated": "fecha o timestamp",
    "last_reported": "fecha o timestamp",
    "last_changed": "fecha o timestamp"
  }
  ```

> **Nota:** El campo `data` debe cumplir con uno de los siguientes esquemas, según el valor del campo `type`:
>
> - **Si `type` es `"Luz"`:**
>   ```json
>   {
>     "state": "on" | "off",
>     "brightness": 0, // número entre 0 y 255
>     "friendly_name": "string"
>   }
>   ```
>
> - **Si `type` es `"Sensor"`:**
>   ```json
>   {
>     "state": 123, // o "123", número o cadena
>     "unit_of_measurement": "string",
>     "friendly_name": "string"
>   }
>   ```
>
> - **Si `type` es `"Switch"`:**
>   ```json
>   {
>     "state": "on" | "off" | "unavailable",
>     "friendly_name": "string"
>   }
>   ```

**Respuestas:**

- **201 - Creado:** Devuelve el objeto creado con los datos parseados.
- **400 - Error de validación:** Si los datos no cumplen con el esquema definido.
- **409 - Conflicto:** Si ya existe una entidad con el mismo `entity_id`.

### 3. Obtener una entidad por ID

- **URL:** `/api/entities/:id`
- **Método:** `GET`

**Respuesta exitosa (200):**

```json
{
  "entity_id": "string",
  "client_id": "string",
  "type": "string",
  "data": { /* objeto JSON con datos según el tipo */ },
  "last_updated": "fecha",
  "last_reported": "fecha",
  "last_changed": "fecha"
}
```

**Errores:**

- **404 - No encontrado:** Si la entidad con el `entity_id` especificado no existe.

### 4. Actualizar una entidad

- **URL:** `/api/entities/:id`
- **Método:** `PUT`
- **Body:** Objeto JSON con los campos a actualizar (se permite actualización parcial, excepto `entity_id` y `client_id`).

**Ejemplo de Body:**

```json
{
  "type": "nuevo_tipo",
  "data": { /* nuevos datos según el tipo */ },
  "last_updated": "nueva_fecha"
}
```

> **Nota:** Al actualizar, si se incluye el campo `data`, éste debe cumplir con uno de los siguientes esquemas, según el valor actual o actualizado del campo `type`:
>
> - **Si `type` es `"Luz"`:**
>   ```json
>   {
>     "state": "on" | "off",
>     "brightness": 0, // número entre 0 y 255
>     "friendly_name": "string"
>   }
>   ```
>
> - **Si `type` es `"Sensor"`:**
>   ```json
>   {
>     "state": 123, // o "123", número o cadena
>     "unit_of_measurement": "string",
>     "friendly_name": "string"
>   }
>   ```
>
> - **Si `type` es `"Switch"`:**
>   ```json
>   {
>     "state": "on" | "off" | "unavailable",
>     "friendly_name": "string"
>   }
>   ```

**Respuestas:**

- **200 - OK:** Devuelve la entidad actualizada.
- **400 - Error de validación:** Si los datos enviados no cumplen con el esquema o si no se proporcionan campos para actualizar.
- **404 - No encontrado:** Si la entidad no existe.

### 5. Eliminar una entidad

- **URL:** `/api/entities/:id`
- **Método:** `DELETE`

**Respuesta exitosa:**

- **204 - Sin Contenido:** La entidad se eliminó correctamente.

**Errores:**

- **404 - No encontrado:** Si la entidad a eliminar no existe.

## Manejo de Errores y Validación

- Se utiliza **Zod** para validar el esquema de los datos (definido en `entity.schema.ts`).
- Los errores de validación retornan un status `400` con los detalles de los errores.
- En caso de errores inesperados, se retorna un status `500` con el mensaje de error.

## Estructura del Proyecto

```plaintext
project/
├── controllers/
│   ├── entities/
│   │   ├── getAllEntities.ts
│   │   ├── createEntity.ts
│   │   ├── getEntity.ts
│   │   ├── updateEntity.ts
│   │   └── deleteEntity.ts
├── routes/
│   └── entities.ts
├── schemas/
│   └── entity.schema.ts
├── database.ts
├── magicString/
│   └── getQuery.ts
├── lib/
│   └── validateDataByTye.ts
└── ...
```