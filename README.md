# ⚽ MiFutbolitoFc

**MiFutbolitoFc** es una aplicación web moderna diseñada para que sigas de cerca las mejores ligas de fútbol. Consulta resultados, próximos partidos, tablas de posiciones y biografías detalladas de jugadores en tiempo real.

Este proyecto extrae información desde [TheSportsDB](https://www.thesportsdb.com/) y cuenta con un sistema inteligente de "autotraducción" mediante Google Translate, para que disfrutes de toda la información de Europa y Colombia en Español.

---

## ✨ Características Principales

- 📅 **Resultados y Próximos Partidos:** Información actualizada de la Champions League, Premier League y Liga BetPlay (Apertura y Finalización).
- 📊 **Tablas Dinámicas:** Capacidad para armar tablas de 36 equipos con lógica personalizada (formato liguilla tipo Champions).
- 🏆 **Fase Eliminatoria (Bracket):** Vista interactiva de llaves (Playoffs, Octavos, Cuartos) generada dinámicamente con agregación de marcadores.
- 🎮 **Minijuegos Gamificados:**
  - *Maestro de Champions:* Trivia histórica con rachas.
  - *Adivina el Escudo:* Desafío contrarreloj para identificar clubes por silueta.
  - *Adivina el Jugador:* Reto de deducción con pistas progresivas (nacionalidad, club, etc.).
- ℹ️ **Detalle de Equipos y Jugadores:** Biografías, uniformes e información histórica de fundación.
- 🕒 **Horarios Locales:** Adaptación automática a tu zona horaria para los partidos.
- 🔍 **Buscador Global:** Capacidad anti-error 404 usando fallbacks con listados de plantillas o últimos partidos para encontrar a cualquier escuadra mundial.

---

## 💻 Stack Tecnológico

- **Framework:** Next.js (App Router)
- **Base de Datos:** Neon (Serverless Postgres)
- **UI:** React
- **Datos:** [TheSportsDB](https://www.thesportsdb.com/) API
- **Despliegue:** Vercel

---

## 🚀 Instalación y Uso Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/SoulOfSparda/MiFutbolitoFc.git
   cd mi-app-futbol
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador preferido.

---

## 🌍 Despliegue

MiFutbolitoFc está optimizado para funcionar y compilarse directamente en Vercel. Sólo requieres enlazar el repositorio apuntando las configuraciones estándar de Next.js.
