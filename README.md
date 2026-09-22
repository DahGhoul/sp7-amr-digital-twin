# SP-7: Gemelo Digital Híbrido para la Vigilancia Regional de la Resistencia a los Antimicrobianos (RAM)

[![Universidad Nacional de Trujillo](https://img.shields.io/badge/UNT-Ingenier%C3%ADa%20de%20Sistemas-003366.svg)](https://unitru.edu.pe)
[![Docker](https://img.shields.io/badge/Docker-Ready%20(Port%203005)-2496ED.svg?logo=docker&logoColor=white)](docker-compose.yml)
[![AI Engine](https://img.shields.io/badge/Google%20AI%20Studio-Gemini%203.8%20Flash-4285F4.svg?logo=google&logoColor=white)](server.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Investigación Científica One Health aplicada a la Región La Libertad (Trujillo, Perú).**  
> Desarrollado por el **Grupo de Investigación SP-7** en la Escuela Profesional de Ingeniería de Sistemas de la **Universidad Nacional de Trujillo (UNT)**.

---

## 📌 Resumen del Proyecto

El **Gemelo Digital SP-7** es una plataforma ciberfísica reactiva diseñada para la detección precoz y contención de brotes hipervirulentos de Resistencia a los Antimicrobianos (RAM). 

A diferencia de los sistemas tradicionales basados únicamente en cultivos hospitalarios con demoras de 7 a 20 días, el sistema SP-7 acopla **tres fuentes de telemetría heterogéneas (Tri-Source Coupling)**:
1. **Genómica Bacteriana (WGS / mNGS):** Detección de genes *blaKPC-3*, *blaNDM-1*, *blaCTX-M-15* y plásmidos epidémicos en los hospitales de referencia (Hospital Regional Docente de Trujillo y Hospital Belén).
2. **Prescripción Farmacológica (Farmacoepidemiología):** Métricas de Dosis Diaria Definida (DDD / 1000 camas-día) de carbapenémicos y fluoroquinolonas.
3. **Epidemiología en Aguas Residuales (WBE):** Cuantificación de copias génicas/L y concentraciones residuales de antibióticos (ng/L) en los colectores metropolitanos de Sedalib (Covicorti y El Cortijo).

El sistema articula estas fuentes mediante modelos mecanicistas de presión selectiva (**PNEC-MIC**) y un motor de razonamiento epidemiológico causal impulsado por **Gemini 3.8 Flash**, logrando una **ventana de alerta temprana de 14 a 21 días**.

---

## 👥 Autores y Afiliación

* **Diego Joel Cuba Moya** - Escuela Profesional de Ingeniería de Sistemas, UNT ([ORCID: 0009-0001-0215-392X](https://orcid.org/0009-0001-0215-392X)) - `djcubamo@unitru.edu.pe`
* **Ronaldo Carlos Robles Romero** - Escuela Profesional de Ingeniería de Sistemas, UNT ([ORCID: 0009-0006-5244-4983](https://orcid.org/0009-0006-5244-4983)) - `rcromeroro@unitru.edu.pe`
* **Dr. Juan Pedro Santos Fernández** *(Asesor y Autor de Correspondencia)* - Docente Investigador, UNT ([ORCID: 0000-0002-8882-9256](https://orcid.org/0000-0002-8882-9256)) - `jsantos@unitru.edu.pe`

---

## 🚀 Despliegue Rápido con Docker

El sistema se encuentra completamente containerizado para garantizar reproducibilidad en cualquier entorno operativo.

```bash
# 1. Clonar el repositorio
git clone https://github.com/DahGhoul/sp7-amr-digital-twin.git
cd sp7-amr-digital-twin

# 2. Configurar la API Key de Gemini
# Edita el archivo .env e introduce tu clave de Google AI Studio:
# GEMINI_API_KEY=tu_clave_aqui

# 3. Levantar con Docker Compose
docker compose up --build -d
```

Abre tu navegador en:
👉 **[http://localhost:3005](http://localhost:3005)**

### Ejecución Local sin Docker (Node.js)
```bash
npm install
npm run dev
```

---

## 🔬 Arquitectura del Sistema

```text
[ Redes Hospitalarias ]     [ Farmacias y PROA ]     [ Colectores Sedalib ]
 (HRDT / Hospital Belén)    (Consumo de Dosis DDD)    (Covicorti / Cortijo)
          │                          │                         │
          ▼                          ▼                         ▼
   WGS / Metagenómica          Presión Clínica          WBE / Concentración ng/L
          └──────────────────────────┼─────────────────────────┘
                                     ▼
                      [ Ingesta y Matriz Ciberfísica ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       [ Modelo Mecanicista ]                 [ Motor Causal Gemini 3.8 ]
      Cálculo PNEC (R_sel)                   Inferencia Epidemiológica Causal
      Proyección a 30-60-90d                 Sistema de Fallback 503 Resiliente
                 └───────────────────┬───────────────────┘
                                     ▼
                    [ Dashboard Operativo React 19 ]
                      - Semáforo Zonal de Riesgo
                      - Directivas de Control PROA
                      - Alerta Temprana (+14 a 21 días)
```

---

## 📄 Publicación y Referencias
Este repositorio contiene el código experimental asociado al artículo de investigación:
> *Gemelo Digital Híbrido SP-7 para la Vigilancia Regional de la Resistencia a los Antimicrobianos (RAM): Acoplamiento Multidimensional de Epidemiología Basada en Aguas Residuales, Prescripciones Clínicas y Datos Genómicos en Trujillo, Perú.* (2026).
