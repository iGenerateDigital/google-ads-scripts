/**
 * @name Negative Keyword Manager
 * @overview Adds campaign-level negatives for costly search terms with low conversions.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - COST_THRESHOLD: Minimum cost before a term is considered (line 17)
 *   - CONVERSION_THRESHOLD: Maximum conversions allowed (line 18)
 *   - DATE_RANGE: Google Ads date range (line 19)
 *   - DRY_RUN: When true, do not apply negatives (line 20)
 * @prerequisites
 *   - Access to campaigns and negative keywords
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var COST_THRESHOLD = 50; // Account currency.
  var CONVERSION_THRESHOLD = 0;
  var DATE_RANGE = "LAST_30_DAYS";
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var costThresholdMicros = Math.round(COST_THRESHOLD * 1000000);

  var query =
    "SELECT campaign.id, campaign.name, search_term_view.search_term, metrics.cost_micros, metrics.conversions " +
    "FROM search_term_view " +
    "WHERE metrics.cost_micros > " + costThresholdMicros + " " +
    "AND metrics.conversions <= " + CONVERSION_THRESHOLD + " " +
    "AND segments.date DURING " + DATE_RANGE;

  var report = AdsApp.report(query);
  var rows = report.rows();

  while (rows.hasNext()) {
    var row = rows.next();
    var campaignId = Number(row["campaign.id"]);
    var keywordText = row["search_term_view.search_term"];

    if (!campaignId || !keywordText) {
      Logger.log("Skipped row due to missing campaign ID or search term.");
      continue;
    }

    var campaignIterator = AdsApp.campaigns().withIds([campaignId]).get();
    if (!campaignIterator.hasNext()) {
      Logger.log("Campaign ID " + campaignId + " not found. Skipping.");
      continue;
    }

    var campaign = campaignIterator.next();
    if (DRY_RUN) {
      Logger.log("[Dry Run] Would add negative keyword '" + keywordText + "' to campaign '" + campaign.getName() + "'.");
      continue;
    }

    campaign.createNegativeKeyword(keywordText);
  }
}
