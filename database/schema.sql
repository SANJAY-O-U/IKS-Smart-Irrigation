-- ============================================================
-- IKS Smart Water Advisor - MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS iks_smart_water_advisor
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE iks_smart_water_advisor;

DROP TABLE IF EXISTS sensor_readings;

CREATE TABLE sensor_readings (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  soil_moisture       DECIMAL(5,2)  NOT NULL COMMENT 'Percentage 0-100',
  temperature         DECIMAL(5,2)  NOT NULL COMMENT 'Degrees Celsius',
  humidity            DECIMAL(5,2)  NOT NULL COMMENT 'Percentage 0-100',
  irrigation_status   VARCHAR(32)   NOT NULL COMMENT 'IRRIGATION REQUIRED | MONITOR | NO IRRIGATION',
  recommendation      VARCHAR(255)  NOT NULL,
  created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_created_at (created_at),
  INDEX idx_irrigation_status (irrigation_status)
) ENGINE=InnoDB;

-- ============================================================
-- Demo / sample records (useful for first run before ESP32 is
-- connected, and for the History page pagination/filter demo)
-- ============================================================

INSERT INTO sensor_readings
  (soil_moisture, temperature, humidity, irrigation_status, recommendation, created_at)
VALUES
  (22.50, 32.10, 45.00, 'IRRIGATION REQUIRED',
   'Soil moisture is 22.5%, indicating dry soil. Temperature is 32.1C and humidity is 45%. Irrigation is recommended.',
   DATE_SUB(NOW(), INTERVAL 5 HOUR)),

  (28.00, 31.40, 48.00, 'IRRIGATION REQUIRED',
   'Soil moisture is 28%, indicating dry soil. Temperature is 31.4C and humidity is 48%. Irrigation is recommended.',
   DATE_SUB(NOW(), INTERVAL 4 HOUR)),

  (41.00, 29.80, 55.00, 'MONITOR',
   'Soil moisture is 41%, which is moderate. Temperature is 29.8C and humidity is 55%. Continue monitoring.',
   DATE_SUB(NOW(), INTERVAL 3 HOUR)),

  (55.30, 28.20, 60.00, 'MONITOR',
   'Soil moisture is 55.3%, which is moderate. Temperature is 28.2C and humidity is 60%. Continue monitoring.',
   DATE_SUB(NOW(), INTERVAL 2 HOUR)),

  (68.00, 26.50, 63.00, 'NO IRRIGATION',
   'Soil moisture is 68%, indicating sufficient moisture. Temperature is 26.5C and humidity is 63%. Avoid unnecessary irrigation.',
   DATE_SUB(NOW(), INTERVAL 1 HOUR)),

  (72.40, 25.90, 66.00, 'NO IRRIGATION',
   'Soil moisture is 72.4%, indicating sufficient moisture. Temperature is 25.9C and humidity is 66%. Avoid unnecessary irrigation.',
   NOW());
