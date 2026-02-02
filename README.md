# AI Scouting - Google Sheets + Apps Script

## Link al Google Sheet
[\[LINK ALLO SHEET\]](https://docs.google.com/spreadsheets/d/1yl7XdBlTAW7UbHuEFiKx_Md7ty4T-XJBDRn1paHUGK4/edit?gid=1910164549#gid=1910164549)

## Descrizione
Prototipo che automatizza lo scouting di acceleratori e startup in Europa e genera value proposition sintetiche per le startup.

### Funzionalità
1. **Scouting accelerators:** 
   Aggiunge gli acceleratori al foglio excel `accelerators`. Per ognuno riempie i campi website, name, country.
2. **Aggiorna startups dagli acceleratori:** 
   Per ogni acceleratore visita (se esistono) i sotto-domini `/portfolio`, `/talent`, `/startups`, `/proyectos` e 
   aggiunge allo sheet `startups` ogni startup. Vengono riempiti i campi `website`, `name`, `country` e `accelerator`.
3. **Genera value proposition mancanti:** 
   Vengono generate le `value_proposition` per ogni startup generando in output una frase simile alla seguente:  
   `Startup <X> helps <Target Y> do <What W> so that <Benefit Z>`
   Questa funzionalità può essere usata più volte per riempire eventuali campi `value_proposition` rimasti vuoti o eliminati manualmente.

### Struttura Google Sheet
- **accelerators:** `website`, `name`, `country`
- **startups:** `website`, `name`, `country`, `accelerator`, `value_proposition`

### Setup
1. Clona il repository:
```bash
git clone https://github.com/Belloa00/ai-paprika-task.git


