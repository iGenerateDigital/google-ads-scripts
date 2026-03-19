/**
 * @name Automated Alerts
 * @overview Sends email alerts when campaigns miss conversion thresholds.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - EMAIL_RECIPIENTS: Comma-separated email list (line 16)
 *   - DATE_RANGE: Stats date range (line 17)
 *   - MIN_CONVERSIONS: Minimum conversions required (line 18)
 * @prerequisites
 *   - MailApp enabled for the account
 * @schedule Daily
 */
function main() {
  // === CONFIGURATION ===
  var EMAIL_RECIPIENTS = "you@example.com";
  var DATE_RANGE = "YESTERDAY";
  var MIN_CONVERSIONS = 1;
  // === END CONFIGURATION ===

  var campaignIterator = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();

  var alerts = [];

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var stats = campaign.getStatsFor(DATE_RANGE);
    if (stats.getConversions() < MIN_CONVERSIONS) {
      alerts.push("Campaign '" + campaign.getName() + "' had " + stats.getConversions() + " conversions.");
    }
  }

  if (alerts.length === 0) {
    Logger.log("No alerts to send.");
    return;
  }

  var subject = "Google Ads Alert: Low Conversions (" + DATE_RANGE + ")";
  var body = "The following campaigns fell below the conversion threshold of " + MIN_CONVERSIONS + ":\n\n" + alerts.join("\n");
  MailApp.sendEmail(EMAIL_RECIPIENTS, subject, body);
}
