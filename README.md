# Cooee Web SDK

[![GitHub version](https://badge.fury.io/gh/letscooee%2Fcooee-android-sdk.svg)](https://badge.fury.io/gh/letscooee%2Fcooee-android-sdk)

## 👋 What is Cooee?

Cooee powers hyper-personalised and real time engagements for mobile & web apps based on machine learning. The SaaS
platform, hosted on cloud infrastructure processes millions of user transactions and data attributes to create unique
and contextual user engagement triggers for end users with simple SDK integration that requires no coding at mobile app
level.

## 🛠 Installation

We at Cooee believe in the developer productivity and that's how our SDKs are written. The installation should take you
no more than two hours. Period!

### Use via CDN

Following are the guidelines for installing Cooee SDK on to your Android mobile app.

#### Step 1: Load SDK Asynchronously

We recommend loading the SDK with the `async` flag so your page load time don't increase. To use it, place the following
code before calling any other CooeeSDK functions.

```html
<script src="https://cdn.jsdelivr.net/npm/@letscooee/web-sdk@latest/dist/sdk.min.js" async></script>
<script>
    window.CooeeSDK = window.CooeeSDK || {events: [], profile: [], account: []};
    CooeeSDK.account.push({"appID": "MY_COOEE_APP_ID", "appSecret": "MY_COOEE_APP_SECRET"});
</script>
```

Replace `MY_COOEE_APP_ID` & `MY_COOEE_APP_SECRET` with the app id & secret given to you.

#### Step 2: Track Custom Events

Once you add the above snippet, the SDK will automatically start tracking some default event. Apart from these, you must
track the given recommended events based on your industry.

```javascript
CooeeSDK.events.push(["Add To Cart", {
    item: {
        id: "15234",
        name: "Shoes"
    }
}]);
```

#### Step 3: Update User Profile

Additional custom attributes/properties can also be shared. We encourage apps to share all properties for better machine
learning modelling.

```javascript
CooeeSDK.profile.push({
    name: "John Doe",
    email: "john@example.com",
    mobile: "9876543210",
    loggedIn: true,
    foo: "bar",
    subscriptions: {
        valid: true,
        pack: 1234
    }
});
```

#### Step 4: CTA Callbacks

Cooee SDK supports callback on the click of in-app notifications actions by returning a map of key-value
pairs i.e. objects in JavaScript.

```javascript
document.addEventListener('onCooeeCTA', function (event) {
    const payload = event.detail;
    
    if (!payload) return;

    if (payload.actionType === "VIEW_ITEM") {
        // Take the user to the given item's page. Item id will be in "payload.id"
    } else if (payload.actionType == "GO_TO_SCREEN") {
        // Take user to the given screen name
    }
}, false);
```
