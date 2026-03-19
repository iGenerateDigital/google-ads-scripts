/**
 * @name Ad Scheduling
 * @overview Creates ad schedules for a campaign if they do not already exist.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - CAMPAIGN_NAME: Campaign to update (line 16)
 *   - SCHEDULES: Array of schedules to apply (line 17)
 *   - DRY_RUN: When true, no changes are applied (line 18)
 * @prerequisites
 *   - Campaign supports ad scheduling
 * @schedule As needed
 */
function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME = "YOUR_CAMPAIGN_NAME";
  var SCHEDULES = [
    { dayOfWeek: "MONDAY", startHour: 9, startMinute: 0, endHour: 17, endMinute: 0, bidModifier: 1.0 },
    { dayOfWeek: "TUESDAY", startHour: 9, startMinute: 0, endHour: 17, endMinute: 0, bidModifier: 1.0 }
  ];
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

  SCHEDULES.forEach(function(schedule) {
    if (scheduleExists(campaign, schedule)) {
      Logger.log("Schedule already exists for " + schedule.dayOfWeek + " " + schedule.startHour + ":" + schedule.startMinute + ".");
      return;
    }

    if (DRY_RUN) {
      Logger.log("[Dry Run] Would create schedule for " + schedule.dayOfWeek + " " + schedule.startHour + ":" + schedule.startMinute + "-" + schedule.endHour + ":" + schedule.endMinute + ".");
      return;
    }

    campaign.addAdSchedule(
      schedule.dayOfWeek,
      schedule.startHour,
      schedule.startMinute,
      schedule.endHour,
      schedule.endMinute,
      schedule.bidModifier
    );
  });
}

function scheduleExists(campaign, schedule) {
  var iterator = campaign.targeting().adSchedules()
    .withCondition("DayOfWeek = " + schedule.dayOfWeek)
    .withCondition("StartHour = " + schedule.startHour)
    .withCondition("StartMinute = " + schedule.startMinute)
    .withCondition("EndHour = " + schedule.endHour)
    .withCondition("EndMinute = " + schedule.endMinute)
    .get();

  return iterator.hasNext();
}
