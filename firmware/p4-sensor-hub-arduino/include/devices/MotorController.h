#pragma once

#include <AccelStepper.h>
#include <Arduino.h>
#include <TMCStepper.h>

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

 private:
  HardwareSerial& serial_;
  TMC2209Stepper driver_;
  AccelStepper stepper_;
  bool velocityMode_ = false;
  bool enabled_ = false;
};
