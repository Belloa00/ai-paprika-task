# AI Scouting - Google Sheets + Apps Script

## Link al Google Sheet
[LINK ALLO SHEET]

## Descrizione
Prototipo che automatizza lo scouting di acceleratori e startup in Europa e genera value proposition sintetiche per le startup.

### Funzionalità
1. **Scouting accelerators:** 
   Aggiunge gli acceleratori al foglio excel "accelerators". Per ognuno riempie i campi website, name, country.
2. **Aggiorna startups dagli acceleratori:** 
   Per ogni acceleratore visita (se esistono) i sotto-domini /portfolio, /talent, /startups, /proyectos e 
   aggiunge allo sheet `startups` ogni startup. Vengono riempiti i campi website, name, country e accelerator.
3. **Genera value proposition mancanti:** 
   Vengono generate le `value_proposition` per ogni startup generando in output una frase simile alla seguente:  
   `Startup <X> helps <Target Y> do <What W> so that <Benefit Z>`

### Struttura Google Sheet
- **accelerators:** `website`, `name`, `country`
- **startups:** `website`, `name`, `country`, `accelerator`, `value_proposition`

### Setup
1. Clona il repository:
```bash
git clone <link_repo>
