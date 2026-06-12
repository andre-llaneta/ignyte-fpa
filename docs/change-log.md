# Change Log

Use this file for confirmed problems/fixes and meaningful design changes. Keep suspected or unverified risks in `docs/possible-issues.md`.

When adding an entry, use this format:

```text
## YYYY-MM-DD - Short Title

What changed:

Why:

Verification:
```

## 2026-06-12 - FireBeetle ESP32-P4 ADC Pin Mapping Fixed

What changed:

- Added `board_build.variant = dfrobot_firebeetle2_esp32p4` to the PlatformIO environment.
- Updated `AnalogD6FSensor::begin()` to perform an initial `analogRead(pin_)` before calling `analogSetPinAttenuation(pin_, ADC_11db)`.

Why:

The generic PlatformIO `esp32-p4` Arduino variant maps `A3` differently than the DFRobot FireBeetle 2 ESP32-P4 variant. The project uses GPIO23 for the D6F analog sensor, which is `A3` on the FireBeetle 2 variant. Without the correct variant, the Arduino ADC core reported:

```text
__analogChannelConfig(): Pin is not configured as analog channel
```

After switching to the DFRobot variant, the ADC core still emitted the same warning because attenuation was set before the first ADC read initialized the pin as an analog channel.

Verification:

Reran PlatformIO build:

```text
pio run
```

Result:

```text
SUCCESS
```

## 2026-06-11 - Motor Commands Routed Through FreeRTOS Queue

What changed:

- Added a motor command queue with depth 8.
- `commandTask` now validates motor JSON commands and queues them.
- `motorTask` now owns `MotorController`, drains queued commands, and applies them before `motor.service()`.
- Motor commands now require their fields instead of defaulting to current motor position.

Why:

`commandTask` and `motorTask` previously touched motor state directly. The queue gives motor state clear ownership and reduces race-condition risk with `AccelStepper`.

Verification:

Reran PlatformIO build:

```text
pio run
```

Result:

```text
SUCCESS
```

## 2026-06-11 - Boot Status Reports Warning Severity

What changed:

- Added optional `severity` to status telemetry.
- Startup failures now report `"severity":"warning"`.
- Final boot status reports `ready_with_warnings` if any warning occurred during setup.

Why:

Boot failures were reported individually, but the final `boot` status always said `ready`. The new status makes bring-up problems easier to spot without changing hardware behavior.

Verification:

Reran PlatformIO build:

```text
pio run
```

Result:

```text
SUCCESS
```

## 2026-06-10 - PlatformIO Build Failed From Edited TMCStepper Header

What changed:

Removed an accidental `move` token from the generated dependency file `.pio/libdeps/esp32-p4/TMCStepper/src/TMCStepper.h`.

Why:

`pio run` failed while compiling `TMCStepper`. The compiler reported:

```text
stray '#' in program
move#pragma once
```

The first line needed to be:

```cpp
#pragma once
```

Verification:

Reran PlatformIO build:

```text
pio run
```

Result:

```text
SUCCESS
```
