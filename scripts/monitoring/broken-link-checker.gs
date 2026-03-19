/**
 * @name Broken Link Checker
 * @overview Logs non-200 responses for enabled ads.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - SLEEP_MS_BETWEEN_REQUESTS: Rate limiting delay (line 16)
 * @prerequisites
 *   - Ads with final URLs
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var SLEEP_MS_BETWEEN_REQUESTS = 200;
  // === END CONFIGURATION ===

  var adIterator = AdsApp.ads()
    .withCondition("Status = ENABLED")
    .withCondition("AdGroupStatus = ENABLED")
    .withCondition("CampaignStatus = ENABLED")
    .get();

  while (adIterator.hasNext()) {
    var ad = adIterator.next();
    var url = ad.urls().getFinalUrl();

    if (!url) {
      Logger.log("Ad ID " + ad.getId() + " has no final URL.");
      continue;
    }

    var responseCode;
    try {
      responseCode = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true }).getResponseCode();
    } catch (e) {
      responseCode = -1;
    }

    if (responseCode !== 200) {
      Logger.log("URL '" + url + "' in ad ID " + ad.getId() + " (" + ad.getType() + ") returned status code " + responseCode + ".");
    }

    // Rate limiting to avoid hitting URL fetch quotas.
    Utilities.sleep(SLEEP_MS_BETWEEN_REQUESTS);
  }
}
