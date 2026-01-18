# Desarrollo de Aplicaciones Web - Equipo

Una página web interactiva para presentar el equipo de desarrollo web con animaciones 3D, modal de tecnologías, carrusel infinito y efectos paralax.

## Características

- **Fondo animado 3D** con líneas flotantes usando Three.js
- **ChromaGrid responsivo** con tarjetas interactivas de equipo
- **Efectos paralax** al pasar el mouse sobre las tarjetas
- **Modal dinámico** con sistema de tabs para categorías de tecnologías
- **Carrusel infinito** con links a sitios web populares para desarrolladores
- **Notificaciones tipo toast** con mensajes personalizados
- **Diseño responsive** (desktop, tablet, mobile)
- **Sin dependencias de frameworks** (HTML, CSS, JavaScript vanilla)

## Estructura de Archivos

```
Desarrollo-Web-Equipo--1/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS (responsive, animaciones)
├── main.js             # Lógica JavaScript vanilla
├── public/
│   └── perfiles/       # Carpeta para imágenes de perfil
│       └── README.md   # Especificaciones de imágenes
└── README.md           # Este archivo
```

## Cómo Usar

### Opción 1: Directamente en el Navegador
```bash
# Simplemente abre index.html en tu navegador
# No se requieren dependencias ni build tools
```

### Opción 2: Servidor Local (recomendado)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con Live Server (VS Code)
# Instala la extensión "Live Server" y abre con click derecho > Open with Live Server
```

Luego abre `http://localhost:8000` (o el puerto configurado)

## Configuración

### Agregar/Editar Miembros del Equipo

En `main.js`, modifica el array `teamMembers`:

```javascript
const teamMembers = [
  {
    id: 1,
    nombre: 'Nombre Completo',
    info: 'Descripción del rol',
    //AQUÍ HAY 4 CATEGORIAS: Lenguajes de programación, Bases de datos, Entornos y dependencias y Maquetación y diseño web.
    //No borrar a menos que no tengan conocimientos en esas categorias.
    lenguajes: [
      'Lenguajes de Programación',

      'Bases de Datos',
      
      'Entornos y Dependencias',
     
      'Maquetación y Diseño Web',
     
    ],
    //También hay ícono que se asignarán en automático si ponen cualquiera de las siguientes redes sociales
    facebook: 'https://facebook.com/usuario',
    instagram: 'https://instagram.com/usuario',
    github: 'https://github.com/usuario',
    linkedin: 'https://linkedin.com/in/usuario',
    imagen: '/perfiles/nombre.jpg'  // o null para usar ícono por defecto
  }
];
```

### Imágenes de Perfil

1. Copia tus imágenes a `/public/perfiles/`
2. Especificaciones recomendadas:
   - **Dimensiones**: 400×400px
   - **Formato**: JPG o PNG
   - **Tamaño**: Menos de 500KB
   - **Relación de aspecto**: 1:1 (cuadrado)

### Personalizar Enlaces del Carrusel

En `main.js`, edita el array `links`:

```javascript
const links = [
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'MDN', url: 'https://mdn.org' },
  // ... más enlaces
];
```
## Responsividad

- **Desktop** (>768px): Grid de 5 columnas, cards 180×320px
- **Tablet** (768px): Grid de 3 columnas, cards más pequeñas
- **Mobile** (<480px): Grid de 1 columna, cards adaptadas

Los puntos de quiebre están en `styles.css` en las media queries.

## 🔧 CDN Utilizados

- **Three.js**: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

Todos los demás recursos son locales (sin dependencias NPM).

### InfiniteCarousel
Carrusel automático que se repite infinitamente.

```javascript
initCarousel(); // Se llama automáticamente
```

## Animaciones

- **Entrada/Salida Modal**: fade in + slide up
- **Tabs de tecnologías**: fade in suave
- **Parallax**: Desplazamiento de cards según mouse
- **Carrusel**: Scroll continuo
- **Hover**: Efectos en cards y botones



Simplemente sube los archivos y asegúrate de que:
1. `index.html` esté en la raíz
2. Las imágenes estén en `/public/perfiles/`

## Licencia

Proyecto educativo del equipo de Desarrollo Web.

## Equipo

- Carlos Mauricio Valadez Espinoza
- Jose Angel Cambranis
- Angel Desiderio Hernandez Sanchez
- Gonzalo Montiel Santos
- Carlo
