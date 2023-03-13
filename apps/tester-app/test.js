window.CooeeSDK = window.CooeeSDK || {events: [], profile: [], account: [], screen: []};

CooeeSDK.account.push({debug: false});
CooeeSDK.account.push({appVersion: '1.2.3+12030'});
CooeeSDK.account.push({appID: '5f9136107d618d7d123cc118'});

CooeeSDK.profile.push({
    name: 'John Doe',
    email: 'john@example.com',
    customerID: 'xyz1234',
    loggedIn: true,
    foo: 'bar',
    subscriptions: {
        valid: true,
        pack: 1234,
    },
});

document.addEventListener('onCooeeCTA', function (event) {
    const payload = event.detail;
    console.log('Payload', payload);

    if (!payload) return;

    if (payload.actionType === 'VIEW_ITEM') {
        // Take the user to the given item's page. Item id will be in "payload.id"
    } else if (payload.actionType === 'GO_TO_SCREEN') {
        // Take user to the given screen name
    }
}, false);
