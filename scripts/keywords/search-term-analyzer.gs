/**
 * @name Search Term Analyzer
 * @overview Finds search terms to add as keywords or negatives and exports to Sheets.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - SPREADSHEET_URL: Destination sheet URL (line 16)
 *   - DATE_RANGE: Stats date range (line 17)
 *   - MIN_CONVERSIONS_FOR_KEYWORD: Minimum conversions to add keyword (line 18)
 *   - MAX_COST_PER_CONVERSION: Max CPA for keyword suggestion (line 19)
 *   - COST_THRESHOLD_FOR_NEGATIVE: Min cost to flag negative (line 20)
 *   - MAX_CONVERSIONS_FOR_NEGATIVE: Max conversions to flag negative (line 21)
 * @prerequisites
 *   - Access to the target Google Sheet
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var SPREADSHEET_URL = "YOUR_SPREADSHEET_URL";
  var DATE_RANGE = "LAST_30_DAYS";
  var MIN_CONVERSIONS_FOR_KEYWORD = 3;
  var MAX_COST_PER_CONVERSION = 50;
  var COST_THRESHOLD_FOR_NEGATIVE = 30;
  var MAX_CONVERSIONS_FOR_NEGATIVE = 0;
  // === END CONFIGURATION ===

  if (!SPREADSHEET_URL || SPREADSHEET_URL === "YOUR_SPREADSHEET_URL") {
    Logger.log("Set SPREADSHEET_URL before running the script.");
    return;
  }

  var query =
    "SELECT campaign.name, ad_group.name, search_term_view.search_term, metrics.clicks, metrics.conversions, metrics.cost_micros " +
    "FROM search_term_view " +
    "WHERE segments.date DURING " + DATE_RANGE;

  var report = AdsApp.report(query);
  var rows = report.rows();

  var keywordRows = [["Campaign", "Ad Group", "Search Term", "Clicks", "Conversions", "Cost", "Cost/Conv"]];
  var negativeRows = [["Campaign", "Ad Group", "Search Term", "Clicks", "Conversions", "Cost"]];

  while (rows.hasNext()) {
    var row = rows.next();
    var cost = Number(row["metrics.cost_micros"]) / 1000000;
    var conversions = Number(row["metrics.conversions"]);
    var clicks = Number(row["metrics.clicks"]);
    var costPerConversion = conversions > 0 ? cost / conversions : Number.POSITIVE_INFINITY;

    if (conversions >= MIN_CONVERSIONS_FOR_KEYWORD && costPerConversion <= MAX_COST_PER_CONVERSION) {
      keywordRows.push([
        row["campaign.name"],
        row["ad_group.name"],
        row["search_term_view.search_term"],
        clicks,
        conversions,
        cost,
        costPerConversion
      ]);
    }

    if (cost >= COST_THRESHOLD_FOR_NEGATIVE && conversions <= MAX_CONVERSIONS_FOR_NEGATIVE) {
      negativeRows.push([
        row["campaign.name"],
        row["ad_group.name"],
        row["search_term_view.search_term"],
        clicks,
        conversions,
        cost
      ]);
    }
  }

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  writeSheet(spreadsheet, "Keyword Suggestions", keywordRows);
  writeSheet(spreadsheet, "Negative Suggestions", negativeRows);
}

function writeSheet(spreadsheet, name, rows) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}
