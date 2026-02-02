// Terzo punto
function generateValuePropositions() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("startups");
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

  data.forEach(function(row, i) {
    let [website, name, country, accelerator, valueProp] = row;
    if (valueProp && valueProp.toString().trim() !== "") {
      return;
    }
    if (!website) return;
    console.log(`Generating value proposition for: ${website}`);

    try {
      const html = fetchHTML(website);
      const value = makeValue(website, name, html);
      sheet.getRange(i + 2, 5).setValue(value);

    } catch (e) {
      console.log(`Error on ${website}: ${e}`);
    }
  });
}

