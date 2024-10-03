// 
// Variables
// 
let lineArr = [];

// form
const formEl = document.querySelector('.form');
const firstName = document.querySelector("#id_first_name");
const lastName = document.querySelector("#id_last_name");
const email = document.querySelector("#id_email");
const expMonth = document.getElementById("id_expiry_month");
const expYear = document.getElementById("id_expiry_year");
const cvvParent = document.getElementById("bankcard-cvv");
const numberParent = document.getElementById("bankcard-number");
const cardErrBlock = document.getElementById("payment-error-block")

const ccCheckbox = document.getElementById('id_use_new_card');
const addCheckbox = document.getElementById('id_same_as_shipping');
const formCC = document.getElementById('form-cc');
const formShip = document.getElementById('form-shipping');
const formBill = document.getElementById('form-billing');
const validErrBlock = document.getElementById("validation-error-block")

// pay method buttons
const btnPaypal = document.querySelector('.pay-with-paypal');
const btnCC = document.querySelector(".pay-with-cc");




/**
 *  Get Campaign
 */

const getCampaign = async () => {
    console.log("get campaign");
    try {

        const response = await fetch(campaignRetrieveURL, {
            method: 'GET',
            headers,
            
        });
        const data = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        }

        console.log(data)

        getCampaignData(data);


    } catch (error) {
        console.log(error);
    }
}

const getCampaignData = (data) => {
    campaignName = data.name;
    campaignCurrency = data.currency;
    payEnvKey = data.payment_env_key;
    Spreedly.init(payEnvKey, { "numberEl": "bankcard-number", "cvvEl": "bankcard-cvv" });
}

/**
 *  Create Cart / New Prospect
 */

const createCart = async () => {

    console.log("create prospect");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    console.log(data);

    const cartData = {
        "user": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email
        },
        "lines": lineArr
    }

    try {
        const response = await fetch(cartsCreateURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(cartData),
            mode: 'no-cors'
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        }


    } catch (error) {
        console.log(error);

    }
}


/**
 * Use Create Order with Credit Card
 */
const createOrder = async () => {
    console.log("Creating order...");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    const orderData = {
        user: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
        },
        lines: lineArr,
        billing_address: {
            country: data.billing_country,
            first_name: data.first_name,
            last_name: data.last_name,
            line1: data.billing_address_line1,
            postcode: data.billing_postcode,
            state: data.billing_state,
        },
        shipping_address: {
            country: data.shipping_country,
            first_name: data.first_name,
            last_name: data.last_name,
            line1: data.shipping_address_line1,
            postcode: data.shipping_postcode,
            state: data.shipping_state,
        },
        billing_same_as_shipping_address: data.billing_same_as_shipping_address === 'true',
        payment_detail: {
            payment_method: data.payment_method,
            card_token: data.card_token,
        },
        shipping_method: data.shipping_method,
        success_url: campaign.nextStep(nextURL),
    };

    console.log("Order Data: ", orderData);

    try {
        const response = await fetch(ordersURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ojQkx0qVzFFTgHGtzRIMGxwstvf5QAfndrvwukzy'
            },
            body: JSON.stringify(orderData),
        });

        // Handle the response properly
        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            handleApiError(result);
            throw new Error('Order creation failed');
        }

        const result = await response.json();
        console.log("Order created successfully:", result);
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while creating the order.');
    }
};


/**
 * Use Create Order with PayPal
 */
async function generateAccessToken() {
    const clientId = 'AYmQiRqBuL90naL0Hari-Fdjtza_Ro8UuT1lEFhIFucanBpMgHUn-lZ10KZC5RsTNfb61EzWD-szBxA1';
    const clientSecret = 'EC6oyzOeQQEStXA1G7GJMRquV8mRnM7EaCS5ePbOWd63fCNSO3F3xTK5eBGsgPxXKk_B5LE9m59nLHYx';
    
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error generating access token:', errorData);
        throw new Error('Error generating access token: ' + errorData.message);
    }

    const data = await response.json();
    return data.access_token;
}

const createPayPalOrder = async () => {
    try {
        const accessToken = await generateAccessToken();
        console.log("Creating PayPal order...");

        const formData = new FormData(formEl); 
        const data = Object.fromEntries(formData);

        btnPaypal.disabled = true;

        let amountValue = calculateTotal();
        amountValue = amountValue.toFixed(2); 

        const orderPPData = {
        intent: 'CAPTURE',
        purchase_units: [
            {
            amount: {
                currency_code: 'USD',
                value: amountValue
            }
            }
        ],
        application_context: {
            return_url: 'http://127.0.0.1:5500/upsell.html',
            cancel_url: 'http://127.0.0.1:5500/cancel.html'
        }
        };

        console.log("Order Data:", orderPPData);

        const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify(orderPPData),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Error creating PayPal order:', result);
            handleError(result);
            btnPaypal.disabled = false;
            return;
        }

        console.log("PayPal order created successfully:", result);
        
        sessionStorage.setItem('ref_id', result.id);

        window.location.href = result.links.find(link => link.rel === 'approve').href;

    } catch (error) {
        console.error('Error:', error);
        handleError({ message: 'An error occurred while creating the PayPal order.' });
        btnPaypal.disabled = false;
    }
};

// Function to handle errors and show messages
const handleError = (result) => {
    let errorMessage = 'Something went wrong.';

    if (result.non_field_errors) {
        errorMessage = result.non_field_errors.join(', ');
    } else if (result.message) {
        errorMessage = result.message;
    }

    validErrBlock.innerHTML = `
        <div class="alert alert-danger">
            ${errorMessage}
        </div>
    `;
};

// Retrieve the campaign data
const retrieveCampaign = campaign.once(getCampaign);
retrieveCampaign();


/**
 * Use Create Create cart to capture prospect if email, first, and last names are valid
 */

const createProspect = () => {

    const email_reg = {
        first: /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
    };
    if (firstName.value != '' && lastName.value != '' && (email_reg.first.test(email.value))) {

        sendProspect()

    }
}
const sendProspect = campaign.once(createCart);


/**
 * Create Packages
 */

const renderPackages = () => {
    const template = `
                    <div class="offer-header d-flex justify-content-between align-items-center border-bottom">
                        <div class="offer-title d-flex align-items-center px-3">
                            <span class="offer-title-text fs-5  text-nowrap"></span>
                        </div>
                        <div class="px-3 py-3 text-nowrap fs-7 fw-bold">
                            <span class="shipping-cost"></span> SHIPPING
                        </div>
                    </div>
                    <div class="offer-content d-flex align-items-center ps-4 py-2">
                        <div class="offer-content-img">
                            <img src="" class="img-fluid p-image">
                        </div>
                        <div class="offer-content-info pe-2 ms-3">
                            <div class="offer-content-price-each  text-primary">
                                <span class="price-each h4 fw-bold"></span>
                                <span class="fs-8 fw-light">/each</span>
                            </div>
                            <div class="offer-content-price-orig text-secondary">
                                <s> 
                                Orig
                                    <span class="price-each-retail"></span>
                                </s>
                            </div>
                            <div class="offer-content-price-total h6 fw-bold text-success">
                                Total:
                                <span class="price-total"></span>
                            </div>
                        </div>
                    </div>
                    `;

    const container = document.querySelector(".offers");

    for (let package of offers.packages) {

        let item = document.createElement("div");
        item.classList.add('offer');
        item.dataset.packageId = package.id;
        item.dataset.name = package.name;
        item.dataset.quantity = package.quantity;
        item.dataset.priceTotal = package.priceTotal.toFixed(2);
        item.dataset.priceEach = package.price.toFixed(2);
        item.dataset.priceShipping = package.shippingPrice.toFixed(2);
        item.dataset.shippingMethod = package.shippingMethod;
        item.innerHTML = template;
        item.querySelector(".offer-title-text").textContent = package.name;
        item.querySelector(".p-image").src = package.image;
        item.querySelector(".price-each-retail").textContent = campaign.currency.format(offers.priceRetail);

        // prices
        let priceElement = item.querySelector('.price-each');
        let priceTotalElement = item.querySelector('.price-total');

        priceElement.textContent = campaign.currency.format(package.price);
        priceTotalElement.textContent = campaign.currency.format(package.priceTotal);

        const truncateByDecimalPlace = (value, numDecimalPlaces) => Math.trunc(value * Math.pow(10, numDecimalPlaces)) / Math.pow(10, numDecimalPlaces)

        if (package.shippingPrice != 0) {
            item.querySelector(".shipping-cost").textContent = package.shippingPrice;
            item.querySelector(".offer-content-price-total").style.display = "none"
        } else {
            item.querySelector(".shipping-cost").textContent = "FREE";
        }

        container.appendChild(item);
    }
}


/**
 * Calculate totals 
 */
const calculateTotal = () => {
    let selectedPackage = document.querySelector(".offer.selected");
    let packagePrice = selectedPackage.dataset.priceTotal;
    let shippingPrice = selectedPackage.dataset.priceShipping;

    let checkoutTotal = parseFloat(packagePrice) + parseFloat(shippingPrice);

    let orderTotal = document.querySelector(".order-summary-total-value");
    orderTotal.textContent = campaign.currency.format(checkoutTotal);

    return checkoutTotal; // Retorna o valor total
}



// 
// Inits & Event Listeners
// 

document.addEventListener("DOMContentLoaded", function(event) {

    renderPackages();

    let firstLineItem = { package_id: selectedOfferId, quantity: 1, is_upsell: false };

    lineArr.push(firstLineItem);

    const summaryShipPrice = document.querySelector('.selected-shipping-price');

    const $offer = document.querySelectorAll('.offer');

    if ($offer) {

        $offer.forEach(function(el, key) {

            el.addEventListener('click', function() {

                el.classList.toggle("selected");

                let pid = el.dataset.packageId;

                let pName = el.dataset.name;

                let pPriceEach = el.dataset.priceEach;

                let pPriceShipping = el.dataset.priceShipping;

                let shippingMethod = el.dataset.shippingMethod;

                let pQuantity = el.dataset.quantity;

                document.getElementById('shipping_method').value = shippingMethod;
                document.querySelector('.selected-product-name').textContent = pName;

                document.querySelector('.selected-product-price').textContent = campaign.currency.format(pPriceEach);

                if (pPriceShipping != 0.00) {
                    summaryShipPrice.textContent = campaign.currency.format(pPriceShipping);

                } else {
                    summaryShipPrice.textContent = "FREE";
                }

                $offer.forEach(function(ell, els) {
                    if (key !== els) {
                        ell.classList.remove('selected');
                    }

                });

                firstLineItem.package_id = pid


                console.log("Change Line Items:", lineArr);

                calculateTotal()


            });
        });
    }


    // initial package setup
    for (const offer of $offer) {

        packageId = offer.dataset.packageId;
        shippingId = offer.dataset.shippingMethod;
        if (packageId === selectedOfferId) {
            offer.classList.add('selected');
            offer.style.order = '-1';
            document.getElementById('shipping_method').value = shippingId;
            document.querySelector('.selected-product-name').textContent = offer.dataset.name;
            document.querySelector('.selected-product-price').textContent = campaign.currency.format(offer.dataset.priceEach);
            if (offer.dataset.priceShipping != 0.00) {
                summaryShipPrice.textContent = campaign.currency.format(offer.dataset.priceShipping);

            } else {
                summaryShipPrice.textContent = "FREE";
            }
        }
    }

    console.log("Default Line Items:", lineArr);
    calculateTotal()

});


firstName.addEventListener('blur', createProspect);
lastName.addEventListener('blur', createProspect);
email.addEventListener('blur', createProspect);

btnPaypal.addEventListener('click', event => {
    validate.revalidateField('#id_first_name'),
        validate.revalidateField('#id_last_name'),
        validate.revalidateField('#id_email')
        .then(isValid => {
            if (isValid) {
                console.log('Paypal Button Clicked');
                document.getElementById('payment_method').value = 'paypal';
                createPayPalOrder();
            } else {
                document.querySelector('.is-invalid').focus();
            }
        });
});

btnCC.addEventListener('click', event => {
    formEl.requestSubmit();
});