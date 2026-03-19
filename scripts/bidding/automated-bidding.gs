/**
 * @name Hourly Bid Modifier Scheduler
 * @overview Applies hourly bid modifiers via ad schedules without changing bidding strategies.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - CAMPAIGN_NAME_CONTAINS: Optional name filter (line 16)
 *   - DAYS_OF_WEEK: Days to update (line 17)
 *   - HOUR_TO_BID_MODIFIER: Hourly modifiers (line 18)
 *   - DEFAULT_BID_MODIFIER: Fallback modifier (line 19)
 *   - DRY_RUN: When true, no changes are applied (line 20)
 * @prerequisites
 *   - Campaigns can accept ad schedule modifiers
 * @schedule Weekly
 */
function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME_CONTAINS = "";
  var DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  var HOUR_TO_BID_MODIFIER = {
    0: 1.0, 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0,
    6: 1.0, 7: 1.0, 8: 1.0, 9: 1.1, 10: 1.1, 11: 1.1,
    12: 1.0, 13: 1.0, 14: 1.0, 15: 0.95, 16: 0.95, 17: 0.95,
    18: 1.0, 19: 1.0, 20: 1.0, 21: 0.9, 22: 0.9, 23: 0.9
  };
  var DEFAULT_BID_MODIFIER = 1.0;
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var campaignSelector = AdsApp.campaigns();
  if (CAMPAIGN_NAME_CONTAINS) {
    campaignSelector = campaignSelector.withCondition('Name CONTAINS_IGNORE_CASE "' + CAMPAIGN_NAME_CONTAINS + '"');
  }

  var campaignIterator = campaignSelector.get();
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();

    DAYS_OF_WEEK.forEach(function(day) {
      for (var hour = 0; hour <= 23; hour++) {
        var modifier = HOUR_TO_BID_MODIFIER.hasOwnProperty(hour) ? HOUR_TO_BID_MODIFIER[hour] : DEFAULT_BID_MODIFIER;
        var endHour = hour === 23 ? 24 : hour + 1;
        var schedule = getAdSchedule(campaign, day, hour, endHour);

        if (schedule) {
          if (DRY_RUN) {
            Logger.log("[Dry Run] Would set bid modifier to " + modifier + " for " + day + " " + hour + ":00-" + endHour + ":00 in campaign '" + campaign.getName() + "'.");
          } else {
            schedule.setBidModifier(modifier);
          }
          continue;
        }

        if (DRY_RUN) {
          Logger.log("[Dry Run] Would create schedule " + day + " " + hour + ":00-" + endHour + ":00 with modifier " + modifier + " in campaign '" + campaign.getName() + "'.");
        } else {
          campaign.addAdSchedule(day, hour, 0, endHour, 0, modifier);
        }
      }
    });
  }
}

function getAdSchedule(campaign, day, startHour, endHour) {
  var iterator = campaign.targeting().adSchedules()
    .withCondition("DayOfWeek = " + day)
    .withCondition("StartHour = " + startHour)
    .withCondition("EndHour = " + endHour)
    .get();

  return iterator.hasNext() ? iterator.next() : null;
}
