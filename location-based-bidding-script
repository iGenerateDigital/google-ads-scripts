function main() {
  // Replace with your campaign's name
  var campaignName = "YOUR_CAMPAIGN_NAME"; 

  // Performance thresholds
  var goodCTRThreshold = 0.05; // Example value: adjust based on your specific data
  var badCTRThreshold = 0.02; // Example value: adjust based on your specific data

  // Bid modifiers
  var increaseBidModifier = 1.2; // Increase bids by 20%
  var decreaseBidModifier = 0.8; // Decrease bids by 20%

  // Get the campaign
  var campaignIterator = AdsApp.campaigns()
      .withCondition('Name = "' + campaignName + '"')
      .get();
  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();

    // Get location performance stats
    var report = AdsApp.report(
      "SELECT RegionCriteriaId, Clicks, Impressions, Ctr " +
      "FROM   GEO_PERFORMANCE_REPORT " +
      "WHERE  CampaignName = '" + campaignName + "' " +
      "AND Impressions > 0 " +
      "DURING LAST_30_DAYS");
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      var CTR = parseFloat(row['Ctr'].replace('%','')) / 100.0;
      var locationId = row['RegionCriteriaId'];
      
      if (CTR >= goodCTRThreshold) {
        campaign.targeting().targetedLocations().get()
          .withCondition('Id = "' + locationId + '"').get()
          .next().setBidModifier(increaseBidModifier);
      } else if (CTR <= badCTRThreshold) {
        campaign.targeting().targetedLocations().get()
          .withCondition('Id = "' + locationId + '"').get()
          .next().setBidModifier(decreaseBidModifier);
      }
    }
  }
}
