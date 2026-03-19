/**
 * @name Quality Score Monitor
 * @overview Tracks keyword quality score distribution and alerts on low scores.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - SPREADSHEET_URL: Destination sheet URL (line 16)
 *   - SHEET_NAME: Worksheet tab name (line 17)
 *   - MIN_QUALITY_SCORE: Alert threshold (line 18)
 *   - EMAIL_RECIPIENTS: Alert recipients (line 19)
 *   - MAX_ALERT_KEYWORDS: Max keywords to list in emails (line 20)
 * @prerequisites
 *   - Access to the target Google Sheet
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var SPREADSHEET_URL = "YOUR_SPREADSHEET_URL";
  var SHEET_NAME = "Quality Score";
  var MIN_QUALITY_SCORE = 5;
  var EMAIL_RECIPIENTS = "you@example.com";
  var MAX_ALERT_KEYWORDS = 25;
  // === END CONFIGURATION ===

  if (!SPREADSHEET_URL || SPREADSHEET_URL === "YOUR_SPREADSHEET_URL") {
    Logger.log("Set SPREADSHEET_URL before running the script.");
    return;
  }

  var distribution = {};
  for (var score = 1; score <= 10; score++) {
    distribution[score] = 0;
  }

  var total = 0;
  var totalScore = 0;
  var lowQuality = [];

  var keywordIterator = AdsApp.keywords()
    .withCondition("Status = ENABLED")
    .withCondition("AdGroupStatus = ENABLED")
    .withCondition("CampaignStatus = ENABLED")
    .get();

  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    var scoreValue = keyword.getQualityScore();
    if (!scoreValue) {
      continue;
    }

    total++;
    totalScore += scoreValue;
    if (distribution.hasOwnProperty(scoreValue)) {
      distribution[scoreValue]++;
    }

    if (scoreValue < MIN_QUALITY_SCORE && lowQuality.length < MAX_ALERT_KEYWORDS) {
      lowQuality.push("'" + keyword.getText() + "' (" + scoreValue + ") in " + keyword.getAdGroup().getName());
    }
  }

  var averageScore = total > 0 ? (totalScore / total) : 0;
  var row = [new Date(), total, averageScore];
  for (var index = 1; index <= 10; index++) {
    row.push(distribution[index]);
  }

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    var header = ["Date", "Keywords", "Avg QS"];
    for (var headerIndex = 1; headerIndex <= 10; headerIndex++) {
      header.push("QS " + headerIndex);
    }
    sheet.appendRow(header);
  }

  sheet.appendRow(row);

  if (lowQuality.length > 0) {
    var subject = "Quality Score Alert: Low QS Keywords";
    var body = "Keywords below quality score " + MIN_QUALITY_SCORE + ":\n\n" + lowQuality.join("\n");
    MailApp.sendEmail(EMAIL_RECIPIENTS, subject, body);
  }
}
