// Terzo punto
function generateValuePropositions() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("startups");
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return; 
  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  const outputValues = [];

  data.forEach(function(row) {
    let [website, name, country, accelerator, valueProp] = row;
    if (valueProp && valueProp.trim() !== "") {
      outputValues.push([valueProp]);
      return;
    }
    console.log(`Generating value proposition for: ${website}`);
    const html = fetchHTML(website);
    const value = makeValue(website, name, html);

    outputValues.push([value]);
  });
  if (outputValues.length > 0) {
    sheet.getRange(2, 5, outputValues.length, 1).setValues(outputValues);
  }
}
