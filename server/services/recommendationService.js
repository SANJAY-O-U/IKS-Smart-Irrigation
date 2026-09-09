// ============================================================
// server/services/recommendationService.js
//
// Simple, transparent RULE-BASED decision logic.
// This is intentionally NOT machine learning / AI - every
// threshold here is a plain if/else so it can be explained in
// a college viva in one sentence: "if moisture is below 30%,
// irrigation is required; between 30-60% we monitor; above 60%
// no irrigation is needed."
// ============================================================

const THRESHOLDS = {
  DRY: 30,
  SUFFICIENT: 60,
};

/**
 * @param {number} soilMoisture - percentage 0-100
 * @param {number} temperature  - degrees Celsius
 * @param {number} humidity     - percentage 0-100
 * @returns {{ status: string, recommendation: string, redLed: boolean, greenLed: boolean }}
 */
function generateRecommendation(soilMoisture, temperature, humidity) {
  const moisture = Number(soilMoisture);
  const temp = Number(temperature);
  const hum = Number(humidity);

  let status;
  let redLed = false;
  let greenLed = false;
  let reason;

  if (moisture < THRESHOLDS.DRY) {
    status = 'IRRIGATION REQUIRED';
    redLed = true;
    greenLed = false;
    reason = 'indicating dry soil';
  } else if (moisture <= THRESHOLDS.SUFFICIENT) {
    status = 'MONITOR';
    redLed = false;
    greenLed = false;
    reason = 'which is moderate';
  } else {
    status = 'NO IRRIGATION';
    redLed = false;
    greenLed = true;
    reason = 'indicating sufficient moisture';
  }

  let actionSentence;
  if (status === 'IRRIGATION REQUIRED') {
    actionSentence = 'Irrigation is recommended.';
  } else if (status === 'MONITOR') {
    actionSentence = 'Continue monitoring.';
  } else {
    actionSentence = 'Avoid unnecessary irrigation.';
  }

  const recommendation =
    `Soil moisture is ${moisture}%, ${reason}. ` +
    `Temperature is ${temp}C and humidity is ${hum}%. ` +
    `${actionSentence}`;

  return { status, recommendation, redLed, greenLed };
}

module.exports = { generateRecommendation, THRESHOLDS };
