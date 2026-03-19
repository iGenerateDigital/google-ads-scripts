/**
 * @name A/B Split Test
 * @overview Alternates two ads by calendar day to force even exposure.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - AD_GROUP_NAME: Ad group to manage (line 16)
 *   - DRY_RUN: When true, no changes are applied (line 17)
 * @prerequisites
 *   - Ad group contains exactly two ads
 * @schedule Daily
 */
function main() {
  // === CONFIGURATION ===
  var AD_GROUP_NAME = "YOUR_ADGROUP_NAME";
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var adGroupIterator = AdsApp.adGroups()
    .withCondition('Name = "' + AD_GROUP_NAME + '"')
    .get();

  if (!adGroupIterator.hasNext()) {
    Logger.log("No ad group found with name: " + AD_GROUP_NAME);
    return;
  }

  var adGroup = adGroupIterator.next();
  var adIterator = adGroup.ads().get();
  var adArray = [];

  while (adIterator.hasNext()) {
    adArray.push(adIterator.next());
  }

  if (adArray.length !== 2) {
    Logger.log("Ad group doesn't contain exactly two ads. Please adjust.");
    return;
  }

  // Even days enable ad 0, odd days enable ad 1 to balance exposure.
  var date = new Date();
  var enableFirstAd = date.getDate() % 2 === 0;

  if (DRY_RUN) {
    Logger.log("[Dry Run] Would " + (enableFirstAd ? "enable" : "pause") + " ad 0 and " + (enableFirstAd ? "pause" : "enable") + " ad 1.");
    return;
  }

  if (enableFirstAd) {
    adArray[0].enable();
    adArray[1].pause();
  } else {
    adArray[0].pause();
    adArray[1].enable();
  }
}
