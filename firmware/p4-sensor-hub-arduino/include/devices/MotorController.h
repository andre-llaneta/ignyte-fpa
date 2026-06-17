#pragma once

#include <AccelStepper.h>
#include <Arduino.h>
#include <TMCStepper.h>

struct TmcDriverDiagnostics {
  uint8_t connection_result = 0;
  uint8_t ifcnt = 0;
  uint32_t ioin = 0;
  uint8_t version = 0;
  uint32_t drv_status = 0;
  uint16_t rms_current_ma = 0;
  uint16_t microsteps = 0;
};

struct TmcStallDiagnostics {
  uint16_t sg_result = 0;
  uint8_t sg_threshold = 0;
  uint32_t drv_status = 0;
  bool diag_pin = false;
  bool enabled = false;
  bool velocity_mode = false;
};

class MotorController {
 public:
  explicit MotorController(HardwareSerial& serial);

  void begin();
  void service();
  void stop();
  void moveToSteps(long steps);
  void moveToMm(float mm);
  void setVelocityMmS(float velocityMmS);
  void homeHere();
  long positionSteps();
  float positionMm();
  bool endstopActive() const;
  bool enabled() const;
  bool velocityMode() const;
  void setEnabled(bool enabled);
  void configureDriver();
  TmcDriverDiagnostics readDriverDiagnostics();
  TmcStallDiagnostics readStallDiagnostics();

 private:
  HardwareSerial& serial_;
  TMC2209Stepper driver_;
  AccelStepper stepper_;
  bool velocityMode_ = false;
  bool enabled_ = false;
};
