/* Function used to return websites present in gs */
function getWebsites(sheetName) {
  const lastRow = sheetName.getLastRow();
  const range   = [2,1];
  if (lastRow < 2) {
    return [];
  }
  const websites = sheetName.getRange(range[0], range[1], lastRow - 1, range[1]).getValues().flat();
  return websites;
}

/* Function used to update websites present in gs */
function normalizeExistingWebsites(sheetName) {
  const lastRow = sheetName.getLastRow();
  const range   = [2,1];
  if (lastRow < 2) {
    return;
  }
  const websites = sheetName.getRange(range[0], range[1], lastRow - 1, range[1]).getValues().flat();
  const url_cleaned = websites.map(function(url) {
    return [cleanUrl(url)];
  });
  sheetName.getRange(2, 1, lastRow - 1, 1).setValues(url_cleaned);
}

/* Function used to clean urls */ 
function cleanUrl(url) { 
  return url .replace(/https?:\/\//, "") 
    .replace(/\/$/, "") 
    .toLowerCase(); 
  }

/* Function to fetch HTML from a url source */
function fetchHTML(url) {
  try {
    const fullUrl = url.startsWith("http") ? url : "https://" + url;
    const response = UrlFetchApp.fetch(fullUrl, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const status = response.getResponseCode();
    const html = response.getContentText();
    if (status >= 200 && status < 300) {
      return html;
    }
    Logger.log(`HTTP Error ${status} for ${fullUrl}`);
    return "";
  } catch (error) {
    Logger.log(`Fetch error for ${url}: ${error}`);
    return "";
  }
}

/* Function that merges all startup results into one result */
function mergeStartupResults(resultsArrays) {
  const map = {};
  resultsArrays.flat().forEach(function(start) {
    if (!start) return;
    const key = (start.website || start.name || "").toLowerCase().trim();
    if (!key) return;
    if (!map[key]) {
      map[key] = {
        website: start.website || "",
        name: start.name || "",
        country: start.country || ""
      };
    }
  });
  return Object.values(map)
}

/* Function to call LLM and make ValueProposition with fallback */
function makeValue(site, name, htmlContent) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_KEY_API");
  function callLLM(snippet) {
    const prompt = `
You are analyzing the website of a STARTUP.

Website domain: ${site}

Write a short, concise value proposition in this format EXACTLY:
Startup <Name> helps <Target Y> do <What W> so that <Benefit Z>.
Example of CORRECT output: "Startup Pollen Robotics helps businesses automate tasks so that they can increase efficiency."
Example of WRONG output: "Startup <Name> helps <Target Y> do <What W> so that <Benefit Z>."

SUBSTITUTE all placeholders: <Name> <Target Y> <What W> <Benefit Z> with proper information about the startup.
Do NOT leave placeholders. Be generic if unsure. Infer informations.

Website HTML snippet:
${snippet}

Return EXACTLY ONE sentence.
Do not add punctuation at the beginning or end.
Do not use line breaks.
Do not explain.
Do not rephrase the instruction.
`;
    const response = UrlFetchApp.fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": "Bearer " + apiKey },
      payload: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 40,
        temperature: 0,
        top_p: 0,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });
    const data = JSON.parse(response.getContentText());
    return (data.choices[0].message.content || "").trim();
  }
  try {
    const snippet = htmlContent.substring(0, 10000);
    let valueProp = callLLM(snippet);

    if (/<Target Y>|<What W>|<Benefit Z>/.test(valueProp)) {
      console.log(`Fallback for ${site}`);
      valueProp = callLLM(htmlContent);
    }

    if (!/^Startup\s+.*\s+helps/i.test(valueProp)) {
      valueProp = `Startup ${name} helps ${valueProp}`;
    }
    return valueProp;
  } catch (err) {
    console.log(`LLM API error for ${site}: ${err}`);
    return "";
  }
}


/* Function that processes html pages to find
startup names and/or links */
function extractStartup(url, chunk) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_KEY_API");
  const prompt = `
You are analyzing the HTML of a website that lists STARTUPS.

GOAL:
Extract startups mentioned in the HTML. Each startup can be mentioned using a link, a text name or similar, so try to identify all plausible startups name ignoring commercial links like "google", "cloudflare" and other general http/html related links. 

For EACH startup found, return:
- "website": the startup website if present, otherwise null
- "name": the startup name
- "country": the startup country if mentioned, otherwise INFER it from the information about the startup, if nothing found use null

RULES:
- Output MUST be valid JSON
- Output MUST be a JSON array
- Do NOT include explanations or text outside JSON
- If no startups are found, return exactly: []

Website being analyzed: ${url}

HTML CHUNK:
${chunk}
`;
  try {
    const response = UrlFetchApp.fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": "Bearer " + apiKey },
      payload: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0
      })
    });
    const data = JSON.parse(response.getContentText());
    const message = data.choices[0].message;
    let extracted = (message.content && message.content.trim()) || (message.reasoning && message.reasoning.trim());
    const jsonMatch = extracted.match(/\[\s*(?:\{[\s\S]*?\}\s*,?\s*)*]/);
    
    if (jsonMatch) {
      const cleanJson = jsonMatch[0];
      try {
        const parsed = JSON.parse(cleanJson);
        console.log(`Extracted startups for ${url}:`, parsed);
        return parsed;
      } catch (jsonErr) {
        console.log(`JSON parse error for ${url}:`, jsonErr);
        return [];
      }
    } else {
      console.log(`No valid JSON found for ${url}`);
      return [];
    }
  } catch (err) {
    console.log(`LLM API error for ${url}: ${err}`);
    return [];
  }
}


