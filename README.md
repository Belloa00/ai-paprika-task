# AI Scouting - Google Sheets + Apps Script

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
## Link al Google Sheet
- Fai una copia del seguente Google Sheet in quanto è condiviso in sola LETTURA: [\[LINK ALLO SHEET\]](https://docs.google.com/spreadsheets/d/1yl7XdBlTAW7UbHuEFiKx_Md7ty4T-XJBDRn1paHUGK4/edit?gid=1910164549#gid=1910164549)
- Apri la copia del Google Sheet e premi su `Estensioni > Apps Script`

## Apps Script (Metodo con CLASP)
- Crea una cartella dove preferisci all'interno del tuo computer (es. cartella `Task_03`)
- Apri un Terminale (PowerShell su Windows) con permessi di Amministratore
- Adesso lancia nel terminale il comando: `cd <percorso cartella Task_03>` e al posto del `<percorso cartella Task_03>` incolla il percorso assoluto della medesima cartella

- Installa [\[Node.js\]](https://nodejs.org/en/download)
- Nel terminale con permessi di amministratore installa CLASP con il seguente comando: 
`npm install -g @google/clasp`
- Effettua il login all'interno del browser che si aprirà lanciando il comando:
`clasp login`
- Clona il repository git con il comando:
`git clone https://github.com/Belloa00/ai-paprika-task.git`
- Spostati nella cartella con il comando:
`cd ai-paprika-task`
- Apri la copia del Google Sheet (copia l'ID del file dall'URL) e poi lancia:
`clasp create --type sheets --title "Task Paprika AI Scouting" --parentId <ID>`
al posto di `<ID>` inserisci l'ID preso dall'URL del Google Sheet (la tua copia).
Se non sai com'è fatto l'ID, ecco un esempio: `https://docs.google.com/spreadsheets/d/ID DA COPIARE/edit#gid=0`
- Adesso puoi lanciare il seguente comando per caricare nel tuo Apps Scripts il codice:
`clasp push`
- Ricarica la pagina con `F5` per vedere le modifiche
- Comparirà nel tuo Google Sheet (copia) un nuovo menu in alto chiamato: **Startup Scouting AI**
- Dal menu puoi eseguire le tre azioni principali

## API Key
Per utilizzare le chiamate all'LLM presente all'interno di alcuni script, è necessario inserire l'API KEY navigando su Apps Script:
`Impostazioni progetto` > `Modifica proprietà script` > `Aggiungi proprietà script` e aggiungere la proprietà: `OPENROUTER_KEY_API` e come valore una API_KEY generata su OpenRouter. Siccome questo è solo un progetto fine a se stesso, la chiave viene inviata separatamente ai diretti interessati, ma di norma non verrebbe inclusa da nessuna parte.

## Assunzioni e Limiti dell'esercizio
- La funzione addAccelerators aggiunge solo un set predefinito di acceleratori europei (6 in questo prototipo). Non esegue scraping reale di nuovi acceleratori dal web.
- Tutti i dati degli acceleratori e delle startup sono considerati unici tramite il campo website. L’URL viene normalizzato. 
- Invece del classico scraping di link usando `regex` per catturare `href`, il prototipo utilizza un LLM per visualizzare l’HTML dei siti degli acceleratori. Questo consente di recuperare anche le startup indicate solo come testo, senza href. Questa scelta è stata fatta perchè molti siti moderni caricano contenuti via JavaScript o API esterne, quindi eventuali link (href) non sarebbero stati visti, nonostante ci fossero nomi di startups presenti.
- Vengono visitati solo /portfolio, /talent, /startups, /proyectos come sotto-domini degli acceleratori.
- La generazione delle startup (secondo tasto) può richiedere diversi minuti (~4 min nel prototipo di test) in quanto viene chiamato un LLM per controllare approfonditamente tutta la pagina HTML e trovare eventuali startups.
- Le frasi sono generate via LLM seguendo il formato `Startup <X> helps <Target Y> do <What W> so that <Benefit Z>`. Alcune potrebbero non venire generate alla prima iterazione, ma la funzione può essere rilanciata per generare solo quelle mancanti fino al riempimento completo delle celle. Può essere usata più volte anche se manualmente decidiamo di rimuovere alcune value_proposition non di nostro gradimento.
- Eventuali errori HTTP o API vengono loggati ma non bloccano mai l’esecuzione delle altre righe.
- Il sistema evita duplicati, ma modifiche manuali ai fogli o cancellazioni parziali possono generare comportamenti inattesi, perciò per testare partivo sempre da fogli (Google Sheet) puliti con solo l'header presente.
- Il batch di `acceleratori` è stato volutamente ridotto a 6, diversamente il codice Apps Script sarebbe durato 1m in più, il che avrebbe comportato la disconnessione del run-time.

**Motivazione dell’uso dell’LLM per le startup:** 
In questo prototipo, l’estrazione delle startup dai siti degli acceleratori avviene tramite un LLM, perché molti siti moderni non espongono direttamente i link delle startup nell’HTML statico, ma li caricano dinamicamente tramite JavaScript o API esterne. In un contesto esterno ad Apps Script, avrei, diversamente, evitato l’LLM eseguendo il “rendering” attivo della pagina (headless browser o librerie di scraping avanzate) per visualizzare gli elementi nascosti e recuperarli senza LLM. L’uso dell’LLM è stato un esperimento fatto che mi ha permesso di ottenere comunque i dati delle startup anche quando erano presenti solo come testo.



