# Carpeta de Perfiles

## 📸 Imágenes de Perfil del Equipo

Cargar aquí las fotos de perfil de los miembros del equipo.

### Nombres de Archivos

- `carlos.jpg` - Mauricio Carlos
- `jose.jpg` - Jose Angel
- `angel.jpg` - Angel Desiderio
- `gonzalo.jpg` - Gonzalo
- `carlo.jpg` - Carlo

### Especificaciones Recomendadas

- **Formato**: JPG o PNG
- **Tamaño**: 400×400px mínimo
- **Aspecto**: Cuadrado (1:1)
- **Peso**: < 500KB para optimizar carga
- **Calidad**: Alta resolución para displays retina

### Uso en la Aplicación

```javascript
imagen: '/perfiles/carlos.jpg'
```

### Sistema de Fallback

Si no existe la imagen o el campo `imagen` es `null`, la aplicación mostrará automáticamente un icono de usuario por defecto con el componente `User` de lucide-react.

