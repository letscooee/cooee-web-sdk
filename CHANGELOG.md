# Change Log

## 0.0.18

1. Store & read app id from local storage when available.
2. Remove the use of app secret.

## 0.0.17

### Features

1. Use the `web` target to avoid loading polyfills.

## 0.0.16

### Features

1. Use fallback color if `backdrop-filter` is not supported.

### Fixes

1. Use `mongo-bson` instead of `bson-objectid` to analyse if this library creates duplicate records.
2. Explicitly set font-family on inner elements.
3. Broken height on some websites.
4. Prevent double loading of the SDK.
5. Use highest z-index possible.

## 0.0.15

### Fixes

1. Use the correct scaling factor for in-apps.

## 0.0.14

### Fixes

1. Scaling down of in-app when rendered in full page.
2. Enforce `display: block` on elements to overwrite site specific rules.

## 0.0.13

### Features

1. Support dynamic canvas size.
2. Ability to set colors on in-app and container separately.

### Improvements

1. Add hand pointer for CTAs.
2. Add push prompt CTA.

## 0.0.11, 0.0.12

### Fixes

1. Rendering condition for x(left) and y(top) position.
2. Rotation of the text.

## 0.0.10 (unreleased)

### Improvement:
1. Get trigger direction(gravity) for InAppTrigger.

### Fixes
1. Rename `prompt` to `pmpt`.
2. Use device api instead of user api to send device data.

## 0.0.9

1. Fix: glassmorphism on iOS.
2. Fix: Fix rendering scaled images.
3. Fix: Update in KPI for CTA.
4. Fix: Do not remove in-app if being used inside an element.

## 0.0.8

1. Feature: Ability of InApp to be rendered inside an element.
2. Fix: Overflowed content should not be rendered.
3. Fix: Placing in-app on east direction.

## 0.0.7

More feature support in the sdk.

## 0.0.6

1. Build: Upgrade TypeScript to 4.4.
2. Fix: Convert \n to `<br>` in texts.

## 0.0.5

Supporting changes based on the in-app composer.

## 0.0.3, 0.0.4

1. Fix generating token because of missing app version.
2. Handle scenario when `CooeeSDK` is not initialised.

## 0.0.2

First functional release.
