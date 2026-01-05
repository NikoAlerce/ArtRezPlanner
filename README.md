
# ArtRes Planner 🎨

Organizador semanal diseñado para residencias artísticas. Gestiona comidas, actividades y tareas de producción con un sistema de turnos equitativo.

## 🚀 Despliegue Rápido

Este proyecto está listo para ser desplegado en servicios de hosting estático:

### Opción 1: Vercel (Recomendado)
1. Sube los archivos a un repositorio de GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. ¡Listo! El archivo `vercel.json` incluido configurará todo automáticamente.

### Opción 2: Netlify
1. Arrastra y suelta la carpeta del proyecto en el panel de Netlify.
2. O conecta tu repositorio de GitHub.

### Opción 3: GitHub Pages
1. Sube el código a GitHub.
2. En `Settings` > `Pages`, selecciona la rama `main` y la carpeta root `/`.

## 🛠️ Tecnologías
- **React 19** (vía ESM)
- **Tailwind CSS** (Estilos rápidos y modernos)
- **html-to-image** (Para exportar el organigrama como PNG)
- **Local Storage** (Para persistencia de datos en el navegador)

## 📋 Reglas de Producción Implementadas
- **Turnos de Cocina**: Almuerzo y Cena integrados como turnos oficiales.
- **Regla Alerce**: Si Mariano o Rocío cocinan la cena, Alerce se encarga automáticamente de la noche.
- **Equidad**: Distribución balanceada de ~10-12 turnos semanales por persona.
