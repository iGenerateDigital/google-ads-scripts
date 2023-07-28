function main() {
  var campaignIterator = AdsApp.campaigns()
    .withCondition('Name = "YOUR_CAMPAIGN_NAME"') // Replace with your campaign's name
    .get();

  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    campaign.createAdSchedule({
      dayOfWeek: "MONDAY",
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      bidModifier: 1.0
    });

    // Add more schedules as needed, like:
    // campaign.createAdSchedule({dayOfWeek: "TUESDAY", startHour: 9, startMinute: 0, endHour: 17, endMinute: 0, bidModifier: 1.0});
  }
}
