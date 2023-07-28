function main() {
  var campaignIterator = AdsApp.campaigns().get();
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var stats = campaign.getStatsFor("YESTERDAY");
    if (stats.getConversions() < 1) {
      Logger.log('Campaign "' + campaign.getName() + '" had no conversions yesterday!');
    }
  }
}
