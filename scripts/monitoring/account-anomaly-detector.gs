/**
 * @name Account Anomaly Detector
 * @overview Compares today's metrics to 7/30-day averages and emails alerts on deviations.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - EMAIL_RECIPIENTS: Alert recipients (line 16)
 *   - THRESHOLD_PERCENT: Deviation threshold (line 17)
 * @prerequisites
 *   - MailApp enabled for notifications
 * @schedule Daily
 */
function main() {
  // === CONFIGURATION ===
  var EMAIL_RECIPIENTS = "you@example.com";
  var THRESHOLD_PERCENT = 0.3;
  // === END CONFIGURATION ===

  var account = AdsApp.currentAccount();
  var todayStats = account.getStatsFor("TODAY");
  var stats7 = account.getStatsFor("LAST_7_DAYS");
  var stats30 = account.getStatsFor("LAST_30_DAYS");

  var metrics = ["impressions", "clicks", "cost", "conversions"];
  var alerts = [];

  metrics.forEach(function(metric) {
    var todayValue = getMetricValue(todayStats, metric);
    var avg7 = getMetricValue(stats7, metric) / 7;
    var avg30 = getMetricValue(stats30, metric) / 30;

    var deviation7 = calculateDeviation(todayValue, avg7);
    var deviation30 = calculateDeviation(todayValue, avg30);

    if (Math.abs(deviation7) >= THRESHOLD_PERCENT || Math.abs(deviation30) >= THRESHOLD_PERCENT) {
      alerts.push(
        metric + ": today=" + todayValue +
        ", 7d avg=" + round(avg7) +
        ", 30d avg=" + round(avg30) +
        ", dev7=" + formatPercent(deviation7) +
        ", dev30=" + formatPercent(deviation30)
      );
    }
  });

  if (alerts.length === 0) {
    Logger.log("No anomalies detected.");
    return;
  }

  var subject = "Google Ads Anomaly Alert";
  var body = "Detected deviations beyond " + formatPercent(THRESHOLD_PERCENT) + ":\n\n" + alerts.join("\n");
  MailApp.sendEmail(EMAIL_RECIPIENTS, subject, body);
}

function getMetricValue(stats, metric) {
  switch (metric) {
    case "impressions":
      return stats.getImpressions();
    case "clicks":
      return stats.getClicks();
    case "cost":
      return stats.getCost();
    case "conversions":
      return stats.getConversions();
    default:
      return 0;
  }
}

function calculateDeviation(value, baseline) {
  if (baseline === 0) {
    return 0;
  }
  return (value - baseline) / baseline;
}

function formatPercent(value) {
  return (value * 100).toFixed(1) + "%";
}

function round(value) {
  return Math.round(value * 100) / 100;
}
