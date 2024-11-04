function trackColumnEdits() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  // Specify the column to track (A=1, B=2, etc.)
  const columnToTrack = 1;  // Change this to your target column
  const historyColumn = 2;  // Column where history will be written
  
  // Get the last row with data
  const lastRow = sheet.getLastRow();
  
  // Initialize history for existing values
  for (let row = 1; row <= lastRow; row++) {
    const currentValue = sheet.getRange(row, columnToTrack).getValue();
    const existingHistory = sheet.getRange(row, historyColumn).getValue();
    
    if (currentValue && !existingHistory) {
      const timestamp = new Date().toLocaleString();
      const initialHistory = `${timestamp}: Initial value → ${currentValue}`;
      sheet.getRange(row, historyColumn).setValue(initialHistory);
    }
  }
  
  // Create trigger for edit events if it doesn't exist
  const triggers = ScriptApp.getProjectTriggers();
  if (triggers.length === 0) {
    ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(ss)
      .onEdit()
      .create();
  }
}

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const column = range.getColumn();
  const row = range.getRow();
  
  // Check if edit was in the tracked column
  if (column === 1) { // Change this to match columnToTrack
    const timestamp = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const oldValue = e.oldValue || '';
    const newValue = range.getValue();
    const history = sheet.getRange(row, 2).getValue(); // Change 2 to match historyColumn
    
    // Check if the last entry is not the same as the new one
    const lastEntry = history.split('\n')[0];
    const newEntry = `${timestamp}: ${oldValue} → ${newValue}`;
    
    if (lastEntry !== newEntry) {
      const newHistory = `${newEntry}\n${history}`;
      sheet.getRange(row, 2).setValue(newHistory);
    }
  }
}