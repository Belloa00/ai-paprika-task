# AI Scouting - Google Sheets + Apps Script

## Link al Google Sheet
[LINK ALLO SHEET]

## Descrizione
Prototipo che automatizza lo scouting di acceleratori e startup in Europa e genera value proposition sintetiche per le startup.

### Funzionalità
1. **Scouting accelerators:** aggiunge nuovi acceleratori europei in batch di 10.
2. **Aggiorna startups dagli acceleratori:** per ogni acceleratore, recupera le startup associate e le aggiunge in `startups`.
3. **Genera value proposition mancanti:** per le startup senza `value_proposition`, visita il sito e genera una frase tipo:  
   `Startup <X> helps <Target Y> do <What W> so that <Benefit Z>`

### Struttura Google Sheet
- **accelerators:** `website`, `name`, `country`
- **startups:** `website`, `name`, `country`, `accelerator`, `value_proposition`

### Setup
1. Clona il repository:
```bash
git clone <link_repo>
