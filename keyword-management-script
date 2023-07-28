function main() {
  var campaignIterator = AdsApp.campaigns()
    .withCondition('Name = "YOUR_CAMPAIGN_NAME"') // Replace with your campaign's name
    .get();

  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var keywordIterator = campaign.keywords().get();
    var maxCostPerConversion = 100; // Set your max cost per conversion

    while (keywordIterator.hasNext()) {
      var keyword = keywordIterator.next();
      var stats = keyword.getStatsFor("LAST_30_DAYS");
      var conversions = stats.getConversions();
      var cost = stats.getCost();
      var costPerConversion = cost / conversions;

      if ((conversions === 0) || (costPerConversion > maxCostPerConversion)) {
        keyword.pause();
        Logger.log("Keyword '" + keyword.getText() + "' was paused due to underperformance.");
      }
    }
  }
}
