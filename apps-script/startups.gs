// Secondo punto
function updateStartups() {
  const accSheet     = SpreadsheetApp.getActive().getSheetByName("accelerators");
  const lastRow = accSheet.getLastRow();
  const startupSheet = SpreadsheetApp.getActive().getSheetByName("startups");
  const subdomains = ['portfolio', 'talent', 'startups', 'proyectos'];

  if (lastRow < 2) return;
  const accDomains = accSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  let output = [];
  accDomains.forEach(function(accelerator) {
  subdomains.forEach(function(subdomain) {
    const url = `https://${accelerator}/${subdomain}`;
    try {
      const html = fetchHTML(url);
      if (!html) return;
      const results = extractStartup(url, html);
      const startups = mergeStartupResults([results]);
      startups.forEach(function(start) {
        output.push([
          start.website && start.website.trim() !== "" ? start.website : start.name,
          start.name,
          start.country,
          accelerator
        ]);
      });
    } catch(err) {
      console.log(`Error: ${err}`);
    }
  });
});
  if (output.length > 0) {
    const startRow = startupSheet.getLastRow() + 1;
    startupSheet.getRange(startRow, 1, output.length, 4).setValues(output);
  }
}

