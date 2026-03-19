/**
 * @name Stock Management
 * @overview Enables or pauses ad groups based on inventory levels.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - INVENTORY_URL: HTTPS endpoint returning JSON stock data (line 16)
 *   - AD_GROUP_NAME_CONTAINS: Prefix used to match products (line 17)
 *   - DRY_RUN: When true, no changes are applied (line 18)
 * @prerequisites
 *   - Inventory JSON in the expected format
 * @schedule Daily
 *
 * Expected JSON format:
 * {
 *   "Product Name": 12,
 *   "Another Product": 0
 * }
 */
function main() {
  // === CONFIGURATION ===
  var INVENTORY_URL = "https://yourwebsite.com/inventory.json";
  var AD_GROUP_NAME_CONTAINS = "Product";
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var inventory = null;
  try {
    var response = UrlFetchApp.fetch(INVENTORY_URL, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) {
      Logger.log("Inventory endpoint returned status " + response.getResponseCode());
      return;
    }
    inventory = JSON.parse(response.getContentText());
  } catch (e) {
    Logger.log("Failed to load inventory JSON: " + e);
    return;
  }

  var adGroupsIterator = AdsApp.adGroups()
    .withCondition('Name CONTAINS_IGNORE_CASE "' + AD_GROUP_NAME_CONTAINS + '"')
    .get();

  while (adGroupsIterator.hasNext()) {
    var adGroup = adGroupsIterator.next();
    var productName = adGroup.getName().replace(AD_GROUP_NAME_CONTAINS, "").trim();

    if (!inventory.hasOwnProperty(productName)) {
      Logger.log("No inventory entry found for '" + productName + "'. Skipping.");
      continue;
    }

    if (inventory[productName] > 0) {
      if (DRY_RUN) {
        Logger.log("[Dry Run] Would enable ad group '" + adGroup.getName() + "' (in stock).");
      } else {
        adGroup.enable();
        Logger.log("Enabled ad group '" + adGroup.getName() + "' (in stock).");
      }
    } else {
      if (DRY_RUN) {
        Logger.log("[Dry Run] Would pause ad group '" + adGroup.getName() + "' (out of stock).");
      } else {
        adGroup.pause();
        Logger.log("Paused ad group '" + adGroup.getName() + "' (out of stock).");
      }
    }
  }
}
