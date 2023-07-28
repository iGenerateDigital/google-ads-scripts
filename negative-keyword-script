function main() {
  // Defining the cost and conversion thresholds.
  var costThreshold = 50.0;
  var conversionThreshold = 0;

  // Query to pull the necessary report.
  var report = AdsApp.report(
    "SELECT Query, Cost, Conversions " +
    "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
    "WHERE Cost > " + costThreshold + " " +
    "AND Conversions <= " + conversionThreshold + " " +
    "DURING LAST_30_DAYS"
  );

  // Run through the report and for each row, add the negative keyword.
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var keywordText = row['Query'];
    var campaign = AdsApp.campaigns().withCondition("CampaignName CONTAINS_IGNORE_CASE '" + row['CampaignName'] + "'").get().next();
    
    // Add the negative keyword at campaign level.
    campaign.createNegativeKeyword(keywordText);
  }
}
