function exportLimeSurvey() {
 var limeuser = "user";
 var limepass = "password";
 var limeurl = "yoururlinstallation";
 var surveyID = "surveyID";
 var documentType = "csv";
 var key;
 var export64Decoded;

// Clear page
 SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().clear();

// Initialization
 var url = limeurl + "/admin/remotecontrol";
 var options = {
  method: "POST",
  headers: {
   "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)",
   "Content-Type": "application/json"
  },
  muteHttpExceptions: true
 };

// Get key
 var sendText = '{"method":"get_session_key","params":["' + limeuser + '","' + limepass + '"],"id":1}';
 options.payload = sendText;
 var response = UrlFetchApp.fetch(url, options);
 var jsonText = response.getContentText();
 var jsonObject = JSON.parse(jsonText);
 key = jsonObject.result;

// Export answers
 sendText = '{"method":"export_responses","params":["' + key + '","' + surveyID + '","' + documentType + '"],"id":1}';
 options.payload = sendText;
 response = UrlFetchApp.fetch(url, options);
 jsonText = response.getContentText();
 jsonObject = JSON.parse(jsonText);
 var export64 = jsonObject.result;

// Decode answers
 export64Decoded = Utilities.base64Decode(export64).toString();

// Close session
 sendText = '{"method":"release_session_key","params":["' + key + '"],"id":1}';
 options.payload = sendText;
 response = UrlFetchApp.fetch(url, options);

// Divide the response into multiple lines
 var lines = export64Decoded.split("\r\n");

// Set values in the sheet
 var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 for (var i = 0; i < lines.length; i++) {
  sheet.getRange(i + 1, 1).setValue(lines);
}

// Convert CSV
var range = sheet.getDataRange();
range.setNumberFormat('@').setHorizontalAlignment('left');

// Disable text wrapping
sheet.getRange("A:A").setWrap(false);
