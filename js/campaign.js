// 
// Variables
// 

const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/'
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': publicKey
}

const confirmationURL = "/thank-you.html";

//
// Methods
// 
let campaign = (function() {

    function nextStep() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length-1).join("/");
        base = location.protocol + '//' + location.host;
        url = new URL(campaignPath + nextURL, base)
        return url.href
    };

    function skipSteps() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length-1).join("/");
        base = location.protocol + '//' + location.host;
        url = new URL(campaignPath + confirmationURL, base)
        return url.href
    };

    // Fire a function only once
    const once = fn => {
        let called = false;
        return function(...args) {
            if (called) return;
            called = true;
            return fn.apply(this, args);
        };
    };

    let currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return { nextStep, skipSteps, once, currency };


})();

// Function to handle form submission
function handleSubmit() {
    const sameAddressCheckbox = document.getElementById('sameAddress');
    
    // Check if checkbox is unchecked
    if (!sameAddressCheckbox.checked) {
        // Collect billing address data
        const billingData = {
            first_name: document.getElementById('id_billing_first_name').value,
            last_name: document.getElementById('id_billing_last_name').value,
            address_line1: document.getElementById('id_billing_address_line1').value,
            city: document.getElementById('id_billing_city').value,
            state: document.getElementById('id_billing_state').value,
            postcode: document.getElementById('id_billing_postcode').value,
            country: document.getElementById('id_billing_country').value
        };

        // Make API call to create an order
        fetch(ordersURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                billing_address: billingData
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Redirect to confirmation page or handle success
            window.location.href = confirmationURL;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error
        });
    } else {
        // If the checkbox is checked, proceed as normal (e.g., submit customer info)
        // Add your logic here
    }
}

// Attach event listener to the submit button
document.getElementById('cc-submit-button').addEventListener('click', handleSubmit)




