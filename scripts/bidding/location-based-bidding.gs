/**
 * @name Location-Based Bidding
 * @overview Adjusts location bid modifiers based on CTR performance.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - CAMPAIGN_NAME: Campaign to adjust (line 16)
 *   - DATE_RANGE: Performance window (line 17)
 *   - GOOD_CTR_THRESHOLD: CTR at or above this gets a lift (line 18)
 *   - BAD_CTR_THRESHOLD: CTR at or below this gets a cut (line 19)
 *   - INCREASE_BID_MODIFIER: Modifier for strong locations (line 20)
 *   - DECREASE_BID_MODIFIER: Modifier for weak locations (line 21)
 *   - DRY_RUN: When true, no changes are applied (line 22)
 * @prerequisites
 *   - Campaign has targeted locations set up
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME = "YOUR_CAMPAIGN_NAME";
  var DATE_RANGE = "LAST_30_DAYS";
  var GOOD_CTR_THRESHOLD = 0.05;
  var BAD_CTR_THRESHOLD = 0.02;
  var INCREASE_BID_MODIFIER = 1.2;
  var DECREASE_BID_MODIFIER = 0.8;
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

  var query =
    "SELECT campaign.id, campaign.name, segments.geo_target_region, metrics.ctr, metrics.impressions " +
    "FROM geographic_view " +
    "WHERE campaign.name = '" + CAMPAIGN_NAME + "' " +
    "AND metrics.impressions > 0 " +
    "AND segments.date DURING " + DATE_RANGE;

  var report = AdsApp.report(query);
  var rows = report.rows();

  while (rows.hasNext()) {
    var row = rows.next();
    var ctr = Number(row["metrics.ctr"]);
    var geoTarget = row["segments.geo_target_region"];
    var locationId = getGeoTargetId(geoTarget);

    if (!locationId) {
      Logger.log("Skipped row due to missing geo target for campaign: " + CAMPAIGN_NAME);
      continue;
    }

    var locationIterator = campaign.targeting()
      .targetedLocations()
      .withCondition("Id = " + locationId)
      .get();

    if (!locationIterator.hasNext()) {
      Logger.log("Campaign does not target location ID " + locationId + ". Skipping.");
      continue;
    }

    var location = locationIterator.next();
    if (ctr >= GOOD_CTR_THRESHOLD) {
      applyBidModifier(location, INCREASE_BID_MODIFIER, DRY_RUN, "increase");
    } else if (ctr <= BAD_CTR_THRESHOLD) {
      applyBidModifier(location, DECREASE_BID_MODIFIER, DRY_RUN, "decrease");
    }
  }
}

function getGeoTargetId(resourceName) {
  if (!resourceName) {
    return null;
  }

  if (String(resourceName).match(/^\d+$/)) {
    return Number(resourceName);
  }

  var match = String(resourceName).match(/(\\d+)/g);
  if (!match || match.length === 0) {
    return null;
  }

  return Number(match[match.length - 1]);
}

function applyBidModifier(location, modifier, dryRun, label) {
  if (dryRun) {
    Logger.log("[Dry Run] Would " + label + " bid modifier to " + modifier + " for location ID " + location.getId() + ".");
    return;
  }

  location.setBidModifier(modifier);
  Logger.log("Set bid modifier to " + modifier + " for location ID " + location.getId() + ".");
}
