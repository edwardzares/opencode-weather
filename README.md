## Weather CLI APP PRO

El objetivo de esta aplicación es que creemos una aplicación de consola que pida que ingresemos la ciudad, Al final, generaremos un binario ejecutable.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar varias otras ciudades para buscar el clima en esas otras ciudades.

## Stack

- Bun.js
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m
```

## Inicializar proyecto

```bash
bun init
```

### Crear el build

```bash
bun run build
bun build --compile --outfile weather src/index.ts
```

### Releases automáticos

El workflow `.github/workflows/release.yml` publica un release en GitHub en cada push a `master`, usando la `version` de `package.json` como tag (`vX.Y.Z`):

1. Actualizar `version` en `package.json`.
2. Hacer push/merge a `master`.
3. La Action corre typecheck + tests, compila los binarios y crea el tag `vX.Y.Z` con los assets adjuntos: `weather-windows-x64.exe`, `weather-linux-x64` y `weather-darwin-arm64`.

Si el release de esa versión ya existe, el workflow no publica nada. También se puede disparar manualmente desde la pestaña **Actions → Release → Run workflow**.

### Ejemplo del menú
Esta es la apariencia que deseamos crear

```bash
════════════════════════════════════════
              MY CLIMA
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (1)
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  6. Pronóstico 7 días
  8. Ajustes (°C)
  9. Salir
════════════════════════════════════════
  Selecciona una opción: 5
```