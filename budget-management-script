function main() {
  // Set the maximum monthly budget in your currency (for example, $1000)
  var maxMonthlyBudget = 1000;

  var campaigns = AdsApp.campaigns().get();
  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var stats = campaign.getStatsFor("THIS_MONTH");
    var cost = stats.getCost();
    if (cost > maxMonthlyBudget) {
      campaign.pause();
      Logger.log("The campaign '" + campaign.getName() + "' has been paused because it reached the maximum monthly budget.");
    }
  }
}
