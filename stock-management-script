function main() {
  // Define a URL where the stock status can be checked.
  var url = "http://yourwebsite.com/inventory.json";
  var response = UrlFetchApp.fetch(url);
  var inventory = JSON.parse(response.getContentText());

  // This is the condition for the ad group name. You might want to adjust it to match your naming convention.
  var adGroupNameContains = "Product";

  var adGroupsIterator = AdsApp.adGroups()
    .withCondition('Name CONTAINS_IGNORE_CASE "' + adGroupNameContains + '"')
    .get();

  while (adGroupsIterator.hasNext()) {
    var adGroup = adGroupsIterator.next();

    var productName = adGroup.getName().replace(adGroupNameContains, "").trim();

    if (inventory.hasOwnProperty(productName)) {
      if (inventory[productName] > 0) {
        adGroup.enable();
        Logger.log(productName + ' is in stock. The ad group "' + adGroup.getName() + '" has been enabled.');
      } else {
        adGroup.pause();
        Logger.log(productName + ' is out of stock. The ad group "' + adGroup.getName() + '" has been paused.');
      }
    }
  }
}
