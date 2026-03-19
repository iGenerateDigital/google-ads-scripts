/**
 * @name Performance Reporting
 * @overview Exports campaign performance metrics to Google Sheets.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - SPREADSHEET_URL: Destination sheet URL (line 16)
 *   - SHEET_NAME: Worksheet tab name (line 17)
 *   - DATE_RANGE: Stats date range (line 18)
 * @prerequisites
 *   - Access to the target Google Sheet
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var SPREADSHEET_URL = "YOUR_SPREADSHEET_URL";
  var SHEET_NAME = "Campaign Performance";
  var DATE_RANGE = "LAST_7_DAYS";
  // === END CONFIGURATION ===

  if (!SPREADSHEET_URL || SPREADSHEET_URL === "YOUR_SPREADSHEET_URL") {
    Logger.log("Set SPREADSHEET_URL before running the script.");
    return;
  }

  var query =
    "SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
    "FROM campaign " +
    "WHERE segments.date DURING " + DATE_RANGE;

  var report = AdsApp.report(query);
  var rows = report.rows();

  var data = [];
  data.push(["Campaign", "Impressions", "Clicks", "Cost", "Conversions"]);

  while (rows.hasNext()) {
    var row = rows.next();
    data.push([
      row["campaign.name"],
      Number(row["metrics.impressions"]),
      Number(row["metrics.clicks"]),
      Number(row["metrics.cost_micros"]) / 1000000,
      Number(row["metrics.conversions"])
    ]);
  }

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  sheet.clearContents();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}
