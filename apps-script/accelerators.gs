// Primo punto
function addAccelerators() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("accelerators");
  normalizeExistingWebsites(sheet);
  const websites = new Set(
    getWebsites(sheet).map(cleanUrl)
  );
  const batchAccelerators = [
    {website: "https://seedcamp.com", name: "Seedcamp", country: "UK"},
    {website: "https://stationf.co", name: "Station F", country: "France"},
    {website: "https://foundersfactory.com", name: "Foundersfactory", country: "UK"},
    {website: "https://lanzadera.es/", name: "Lanzadera", country: "Spain"},
    {website: "https://innovx.com/", name: "InnovX", country: "Romania"},
    {website: "https://unicornfactorylisboa.com/", name: "Unicorn", country: "Spain"},
    {website: "https://accelerace.io/", name: "Accelerance", country: "Denmark"}
];
  const newRows = [];
  batchAccelerators.forEach(function(entry) {
    const domain = cleanUrl(entry.website);
    if (!websites.has(domain)) {
      newRows.push([domain, entry.name, entry.country]);
      websites.add(domain);
    }
  });
  const newLen = newRows.length
  if (newLen) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newLen, 3).setValues(newRows);
  }
}