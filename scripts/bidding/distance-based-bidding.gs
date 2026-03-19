/**
 * @name Distance-Based Targeting
 * @overview Adds proximity targets with bid modifiers around a location.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - CAMPAIGN_NAME: Campaign to update (line 16)
 *   - LOCATION_ADDRESS: Center address for proximity (line 17)
 *   - NEAR_RADIUS_MILES: Near radius (line 18)
 *   - FAR_RADIUS_MILES: Far radius (line 19)
 *   - NEAR_BID_MODIFIER: Modifier for near radius (line 20)
 *   - FAR_BID_MODIFIER: Modifier for far radius (line 21)
 *   - DRY_RUN: When true, no changes are applied (line 22)
 * @prerequisites
 *   - Campaign targeting supports proximity
 * @schedule Monthly
 */
function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME = "YOUR_CAMPAIGN_NAME";
  var LOCATION_ADDRESS = "YOUR_ADDRESS";
  var NEAR_RADIUS_MILES = 5;
  var FAR_RADIUS_MILES = 20;
  var NEAR_BID_MODIFIER = 1.2;
  var FAR_BID_MODIFIER = 0.8;
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

  if (DRY_RUN) {
    Logger.log("[Dry Run] Would add proximity targets at " + LOCATION_ADDRESS + ".");
    return;
  }

  campaign.targeting().newProximity()
    .address(LOCATION_ADDRESS)
    .radius(NEAR_RADIUS_MILES, "MILES")
    .bidModifier(NEAR_BID_MODIFIER)
    .build();

  campaign.targeting().newProximity()
    .address(LOCATION_ADDRESS)
    .radius(FAR_RADIUS_MILES, "MILES")
    .bidModifier(FAR_BID_MODIFIER)
    .build();
}
