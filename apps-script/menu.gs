// Menu con 3 azioni
function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("Startup Scouting AI")
  .addItem("Scouting accelerators", "addAccelerators")
  .addItem("Aggiorna startups dagli acceleratori", "updateStartups")
  .addItem("Genera value proposition mancanti", "generateValuePropositions")
  .addToUi();
}