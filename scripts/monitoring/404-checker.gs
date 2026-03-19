/**
 * @name 404 Checker
 * @overview Pauses ads that point to 404 pages.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - PAUSE_ON_404: Whether to pause ads that return 404 (line 16)
 *   - DRY_RUN: When true, do not pause ads (line 17)
 * @prerequisites
 *   - Ads with final URLs
 * @schedule Daily
 */
function main() {
  // === CONFIGURATION ===
  var PAUSE_ON_404 = true;
  var DRY_RUN = true;
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
      Logger.log("Ad ID " + ad.getId() + " has no final URL. Skipping.");
      continue;
    }

    var responseCode = null;
    try {
      var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
      responseCode = response.getResponseCode();
    } catch (e) {
      Logger.log("Fetch failed for ad ID " + ad.getId() + ": " + e);
      continue;
    }

    if (responseCode === 404) {
      var adLabel = "Ad ID " + ad.getId() + " (" + ad.getType() + ")";
      if (PAUSE_ON_404) {
        if (DRY_RUN) {
          Logger.log("[Dry Run] Would pause " + adLabel + " due to 404: " + url);
        } else {
          ad.pause();
          Logger.log("Paused " + adLabel + " due to 404: " + url);
        }
      } else {
        Logger.log(adLabel + " returned 404: " + url);
      }
    }
  }
}
