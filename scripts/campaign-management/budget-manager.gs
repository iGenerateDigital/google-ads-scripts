/**
 * @name Budget Management
 * @overview Pauses campaigns that exceed a monthly cost threshold.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - MAX_MONTHLY_BUDGET: Monthly spend cap (line 16)
 *   - DATE_RANGE: Stats date range (line 17)
 *   - EMAIL_RECIPIENTS: Notification emails (line 18)
 *   - DRY_RUN: When true, no changes are applied (line 19)
 * @prerequisites
 *   - MailApp enabled for notifications
 * @schedule Daily
 */
function main() {
  // === CONFIGURATION ===
  var MAX_MONTHLY_BUDGET = 1000;
  var DATE_RANGE = "THIS_MONTH";
  var EMAIL_RECIPIENTS = "you@example.com";
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var campaigns = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();

  var pausedCampaigns = [];

  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var stats = campaign.getStatsFor(DATE_RANGE);
    var cost = stats.getCost();
    if (cost > MAX_MONTHLY_BUDGET) {
      if (DRY_RUN) {
        Logger.log("[Dry Run] Would pause campaign '" + campaign.getName() + "' (cost " + cost + ").");
      } else {
        campaign.pause();
        pausedCampaigns.push("Paused '" + campaign.getName() + "' after spending " + cost + ".");
      }
    }
  }

  if (!DRY_RUN && pausedCampaigns.length > 0) {
    MailApp.sendEmail(
      EMAIL_RECIPIENTS,
      "Google Ads Budget Alert",
      "The following campaigns were paused for exceeding the monthly budget of " + MAX_MONTHLY_BUDGET + ":\n\n" + pausedCampaigns.join("\n")
    );
  }
}
