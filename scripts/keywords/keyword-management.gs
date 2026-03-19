/**
 * @name Keyword Management
 * @overview Pauses underperforming keywords based on cost per conversion.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - CAMPAIGN_NAME: Campaign to manage (line 16)
 *   - DATE_RANGE: Stats date range (line 17)
 *   - MAX_COST_PER_CONVERSION: Threshold to pause (line 18)
 *   - DRY_RUN: When true, do not pause keywords (line 19)
 * @prerequisites
 *   - Campaign contains keywords to evaluate
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME = "YOUR_CAMPAIGN_NAME";
  var DATE_RANGE = "LAST_30_DAYS";
  var MAX_COST_PER_CONVERSION = 100;
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var campaignIterator = AdsApp.campaigns()
    .withCondition('Name = "' + CAMPAIGN_NAME + '"')
    .get();

  if (!campaignIterator.hasNext()) {
    Logger.log("No campaign found with name: " + CAMPAIGN_NAME);
    return;
  }

  var campaign = campaignIterator.next();
  var keywordIterator = campaign.keywords().get();

  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    var stats = keyword.getStatsFor(DATE_RANGE);
    var conversions = stats.getConversions();
    var cost = stats.getCost();
    var costPerConversion = conversions > 0 ? cost / conversions : Number.POSITIVE_INFINITY;

    if (conversions === 0 || costPerConversion > MAX_COST_PER_CONVERSION) {
      if (DRY_RUN) {
        Logger.log("[Dry Run] Would pause keyword '" + keyword.getText() + "' due to underperformance.");
      } else {
        keyword.pause();
        Logger.log("Paused keyword '" + keyword.getText() + "' due to underperformance.");
      }
    }
  }
}
