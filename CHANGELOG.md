# Change Log

## 1.1.0

1. Feat: Store GA's clientId in server for GA integration.

## 1.0.2

1. Fix: Send the CTA before executing the click action.

## 1.0.0, 1.0.1

1. Breaking Change: The attribution will now start when CTA is clicked instead of when trigger is displayed.
2. Fix: Prevent double adding embedded trigger.

## 0.4.0

1. Feat: Delayed in-app feature.

## 0.3.1

1. Fix: Handle non-24 characters app ID.

## 0.3.0

1. Animation feature.

## 0.2.1

1. Fix: Handle "null" or "undefined" string in App ID.

## 0.2.0

### Features

1. Edge spacing for in-apps.

## 0.1.6

### Fixes

1. Set default letter-spacing.

## 0.1.5

### Features

1. Allow background to be overridden for mobile.

### Fixes

1. Setting overflow for canva/container.

## 0.1.4

### Features

1. Track the UTM parameters and referrals.

### Fixes

1. Bump session number before starting the session.

## 0.1.3

### Fixes

1. Close the in-app when clicked outside.

## 0.1.2

### Fixes

1. Properly check for mobile devices.
2. Refactor the rendering of wrapper & container.
3. By default add padding of 15px in all the cases.
4. Upgrade ua-parser-js.

## 0.1.1

### Fix

1. Set margin on the container instead of wrapper.
2. Add a class in the container.

## 0.1.0

### Features

1. Separate cover, max size and gravity configuration for mobile browsers.

## 0.0.35

### Features

1. Track private/incognito window.
2. Use a generic class name for all in-app triggers.

## 0.0.34

### Features:

1. Sending `CE Session Started` event.
2. Support of direction in the shadow.

## 0.0.32, 0.0.33

### Features:

1. Deprecate `event.props.triggerID` for trigger events and use `event.trigger` instead.
2. Expose logout API.
3. Track `host` as `location.origin` in device properties.

## 0.0.31

### Features:

1. Ability to apply transparency to the elements.
2. Ability to add shadow to the elements.

## 0.0.30

### Features:

1. Ability to use brand fonts.

## 0.0.29

### Feature:

1. Validation of CTA data.

## 0.0.28

### Fix:

1. Checking empty URLs for CTA.

## 0.0.27

### Feature:

1. Added Go to URL CTA.

## 0.0.26

1. Fix: Preview in case parent element is not body.\

## 0.0.25

1. Fix: Scrolling of in-app notification.
2. Feature: Use cover to process in-app background.

## 0.0.24

1. Feature: Ability to control the size of the in-app.
2. Feature: Non-bocking UI of in-app.

## 0.0.23

1. Add `id` on sending event.

## 0.0.22

1. Rollback legacy "CE Screen View" event.
2. Use a JS Flag to turn it off.

## 0.0.21

1. Introduce endpoint to set screen name.

## 0.0.20

1. Support fonts listed client-portal.

## 0.0.19

1. Do not allow SDK to kick-in if being used by a Bot.

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
