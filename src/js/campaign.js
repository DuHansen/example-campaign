// Variables

const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/';
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': publicKey,
};

const confirmationURL = "/thank-you.html";

// Methods
let campaign = (function() {

    function nextStep() {
        const path = location.pathname.split("/");
        const campaignPath = path.slice(0, path.length - 1).join("/");
        const base = location.protocol + '//' + location.host;
        const url = new URL(campaignPath + nextURL, base);
        return url.href;
    }

    function skipSteps() {
        const path = location.pathname.split("/");
        const campaignPath = path.slice(0, path.length - 1).join("/");
        const base = location.protocol + '//' + location.host;
        const url = new URL(campaignPath + confirmationURL, base);
        return url.href;
    }

    // Fire a function only once
    const once = (fn) => {
        let called = false;
        return function(...args) {
            if (called) return;
            called = true;
            return fn.apply(this, args);
        };
    };

    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return { nextStep, skipSteps, once, currency };

})();

export default campaign; // Adicione esta linha para exportar a variável campaign
