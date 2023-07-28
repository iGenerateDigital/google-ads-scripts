function main() {
  var report = AdsApp.report(
    "SELECT CampaignName, Impressions, Clicks, Cost, Conversions " +
    "FROM CAMPAIGN_PERFORMANCE_REPORT " +
    "DURING LAST_7_DAYS"
  );
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    Logger.log(row["CampaignName"] + "," + row["Impressions"] + "," + row["Clicks"] + "," + row["Cost"] + "," + row["Conversions"]);
  }
}
