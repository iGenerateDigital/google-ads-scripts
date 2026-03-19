/**
 * @name Spreadsheet Reporting
 * @overview Exports campaign, ad group, and keyword performance to Google Sheets.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - SPREADSHEET_URL: Destination sheet URL (line 16)
 *   - DATE_RANGE: Stats date range (line 17)
 *   - INCLUDE_CAMPAIGNS: Export campaign stats (line 18)
 *   - INCLUDE_AD_GROUPS: Export ad group stats (line 19)
 *   - INCLUDE_KEYWORDS: Export keyword stats (line 20)
 * @prerequisites
 *   - Access to the target Google Sheet
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var SPREADSHEET_URL = "YOUR_SPREADSHEET_URL";
  var DATE_RANGE = "LAST_30_DAYS";
  var INCLUDE_CAMPAIGNS = true;
  var INCLUDE_AD_GROUPS = true;
  var INCLUDE_KEYWORDS = true;
  // === END CONFIGURATION ===

  if (!SPREADSHEET_URL || SPREADSHEET_URL === "YOUR_SPREADSHEET_URL") {
    Logger.log("Set SPREADSHEET_URL before running the script.");
    return;
  }

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

  if (INCLUDE_CAMPAIGNS) {
    var campaignQuery =
      "SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
      "FROM campaign " +
      "WHERE segments.date DURING " + DATE_RANGE;
    exportReport(spreadsheet, campaignQuery, "Campaigns", [
      "Campaign ID",
      "Campaign",
      "Impressions",
      "Clicks",
      "Cost",
      "Conversions"
    ], function(row) {
      return [
        row["campaign.id"],
        row["campaign.name"],
        Number(row["metrics.impressions"]),
        Number(row["metrics.clicks"]),
        Number(row["metrics.cost_micros"]) / 1000000,
        Number(row["metrics.conversions"])
      ];
    });
  }

  if (INCLUDE_AD_GROUPS) {
    var adGroupQuery =
      "SELECT campaign.name, ad_group.id, ad_group.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
      "FROM ad_group " +
      "WHERE segments.date DURING " + DATE_RANGE;
    exportReport(spreadsheet, adGroupQuery, "Ad Groups", [
      "Campaign",
      "Ad Group ID",
      "Ad Group",
      "Impressions",
      "Clicks",
      "Cost",
      "Conversions"
    ], function(row) {
      return [
        row["campaign.name"],
        row["ad_group.id"],
        row["ad_group.name"],
        Number(row["metrics.impressions"]),
        Number(row["metrics.clicks"]),
        Number(row["metrics.cost_micros"]) / 1000000,
        Number(row["metrics.conversions"])
      ];
    });
  }

  if (INCLUDE_KEYWORDS) {
    var keywordQuery =
      "SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, " +
      "metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
      "FROM keyword_view " +
      "WHERE segments.date DURING " + DATE_RANGE;
    exportReport(spreadsheet, keywordQuery, "Keywords", [
      "Campaign",
      "Ad Group",
      "Keyword",
      "Match Type",
      "Impressions",
      "Clicks",
      "Cost",
      "Conversions"
    ], function(row) {
      return [
        row["campaign.name"],
        row["ad_group.name"],
        row["ad_group_criterion.keyword.text"],
        row["ad_group_criterion.keyword.match_type"],
        Number(row["metrics.impressions"]),
        Number(row["metrics.clicks"]),
        Number(row["metrics.cost_micros"]) / 1000000,
        Number(row["metrics.conversions"])
      ];
    });
  }
}

function exportReport(spreadsheet, query, sheetName, headers, rowMapper) {
  var report = AdsApp.report(query);
  var rows = report.rows();
  var data = [headers];

  while (rows.hasNext()) {
    data.push(rowMapper(rows.next()));
  }

  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  sheet.clearContents();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}
