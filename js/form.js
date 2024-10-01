/**
 * Form validation with just-validatate.js
 */
const validate = new JustValidate(formEl, {
    errorFieldCssClass: ['is-invalid']
});

validate
    .addField(
        '#id_first_name',
        [{
                rule: 'required',
                errorMessage: 'First name is required',
            },

            {
                rule: 'maxLength',
                value: 255,
            },
            {
                rule: 'customRegexp',
                value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
                errorMessage: 'Contains an invalid character',
            },

        ],

        {
            errorsContainer: '.invalid-fname',
        }
    )
    .addField(
        '#id_last_name',
        [{
                rule: 'required',
                errorMessage: 'Last name is required',
            },

            {
                rule: 'maxLength',
                value: 255,
            },
            {
                rule: 'customRegexp',
                value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
                errorMessage: 'Contains an invalid character',

            },
        ],

        {
            errorsContainer: '.invalid-lname',
        }
    )

    .addField(
        '#id_email',
        [{
                rule: 'required',
                errorMessage: 'Email is required',
            },
            {
                rule: 'email',
                errorMessage: 'Email is invalid!',
            },
            {
                rule: 'maxLength',
                value: 255,
            },
        ],

        {
            errorsContainer: '.invalid-email',

        }
    )
    .addField(
        '#id_phone_number', 
        [{
                rule: 'required',
                errorMessage: 'Valid US phone number required',
            },

            {
                rule: 'customRegexp',
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                errorMessage: 'Invalid Number',

            },
            {
                rule: 'maxLength',
                value: 15,
            },
        ],
        {

            errorsContainer: '.invalid-ph',

        }
    )
    .addField('#id_shipping_address_line4', [{
            rule: 'required',
            errorMessage: 'Shipping address is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },
    ], {

        errorsContainer: '.invalid-shipping_address_line4',

    })
    .addField('#id_shipping_city', [{
            rule: 'required',
            errorMessage: 'Shipping city is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },

    ], {

        errorsContainer: '.invalid-shipping_address_city',

    })
    .addField('#id_shipping_state', [{
        rule: 'required',
        errorMessage: 'Shipping state/province is required',
    }, ], {

        errorsContainer: '.invalid-shipping_state',

    })
    .addField('#id_shipping_postcode', [{
            rule: 'required',
            errorMessage: 'Shipping ZIP/Postcode is required',
        },
        {
            rule: 'maxLength',
            value: 64,
        },
    ], {

        errorsContainer: '.invalid-shipping_postcode',

    })
    .addField('#id_shipping_country', [{
        rule: 'required',
        errorMessage: 'Shipping country is required',
    }, ], {

        errorsContainer: '.invalid-shipping_country',

    })

    //Billing Address validation
    .addField(
        '#id_billing_first_name',
        [{
                rule: 'required',
                errorMessage: 'First name is required',
            },

            {
                rule: 'maxLength',
                value: 255,
            },
            {
                rule: 'customRegexp',
                value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
                errorMessage: 'Contains an invalid character',
            },

        ],

        {
            errorsContainer: '.invalid-billing-fname',
        }
    )
    .addField(
        '#id_billing_last_name',
        [{
                rule: 'required',
                errorMessage: 'Last name is required',
            },

            {
                rule: 'maxLength',
                value: 255,
            },
            {
                rule: 'customRegexp',
                value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
                errorMessage: 'Contains an invalid character',

            },
        ],

        {
            errorsContainer: '.invalid-billing-lname',
        }
    )
    .addField('#id_billing_address_line3', [{
            rule: 'required',
            errorMessage: 'Billing address is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },
    ], {

        errorsContainer: '.invalid-billing_address_line3',

    })
    .addField('#id_billing_house', [{
            rule: 'required',
            errorMessage: 'House is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },
    ], {

        errorsContainer: '.invalid-billing_house',

    })
    .addField('#id_billing_city', [{
            rule: 'required',
            errorMessage: 'Shipping city is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },

    ], {

        errorsContainer: '.invalid-billing_city',

    })
    .addField('#id_billing_state', [{
        rule: 'required',
        errorMessage: 'Billing state/province is required',
    }, ], {

        errorsContainer: '.invalid-billing_state',

    })
    .addField('#id_billing_postcode', [{
            rule: 'required',
            errorMessage: 'Billing ZIP/Postcode is required',
        },
        {
            rule: 'maxLength',
            value: 64,
        },
    ], {

        errorsContainer: '.invalid-billing_postcode',

    })
    .addField('#id_billing_country', [{
        rule: 'required',
        errorMessage: 'Billing country is required',
    }, ], {

        errorsContainer: '.invalid-billing_country',

    })

    .onFail((fields) => {
        console.log('Field validation fail', fields);
    })
    .onSuccess((event) => {
        console.log('Field validation pass, submit card details', event);
        document.getElementById('payment_method').value = 'card_token';
        Spreedly.validate();
    });


/**
 * Card Validation with Spreedly iFrame
 */

const style = 'color: #212529; font-size: 1rem; line-height: 1.5; font-weight: 400;width: calc(100% - 20px); height: calc(100% - 2px); position: absolute;padding: 0.13rem .75rem';

// Set placeholders and styles for iframe fields to make UI style
Spreedly.on("ready", function() {
    Spreedly.setFieldType('text');
    Spreedly.setPlaceholder('cvv', "CVV");
    Spreedly.setPlaceholder('number', "Card Number");
    Spreedly.setNumberFormat('prettyFormat');
    Spreedly.setStyle('cvv', style);
    Spreedly.setStyle('number', style);
    btnCC.removeAttribute('disabled');
});

// Handle form submit and tokenize the card
function submitPaymentForm() {
    cardErrBlock.innerHTML = ''; // Reset error block

    var requiredFields = {
        "first_name": firstName.value,
        "last_name": lastName.value,
        "month": expMonth.value,
        "year": expYear.value,
        // Add billing fields if they are not the same as shipping
        ...(document.getElementById('sameAddress').checked ? {} : {
            "billing_first_name": document.getElementById('id_billing_first_name').value,
            "billing_last_name": document.getElementById('id_billing_last_name').value,
            "billing_address_line1": document.getElementById('id_billing_address_line3').value,
            "billing_city": document.getElementById('id_billing_city').value,
            "billing_postcode": document.getElementById('id_billing_postcode').value,
            "billing_country": document.getElementById('id_billing_country').value
        })
    };

    // Validate required fields
    for (const key in requiredFields) {
        if (!requiredFields[key]) {
            cardErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    ${key.replace(/_/g, ' ').replace('billing', 'Billing ')} is required.
                </div>
            `;
            return; // Exit if any field is missing
        }
    }

    Spreedly.tokenizeCreditCard(requiredFields);
}

// Handle tokenization errors from Spreedly to show to end user
Spreedly.on('errors', function(errors) {
    console.log('Card validation fail', errors);
    let error_html = '';
    
    errors.forEach(element => {
        error_html += `${element.message}<br/>`;
        
        const { attribute } = element;
        if (attribute === "number") {
            numberParent.classList.add("is-invalid");
            numberParent.classList.remove("is-valid");
        } else if (attribute === "month") {
            expMonth.classList.add("is-invalid");
            document.querySelector('.is-invalid').focus();
        } else if (attribute === "year") {
            expYear.classList.add("is-invalid");
            document.querySelector('.is-invalid').focus();
        } else {
            numberParent.classList.remove("is-invalid");
        }
    });

    if (error_html) {
        cardErrBlock.innerHTML = `
            <div class="alert alert-danger">
                ${error_html}
            </div>
        `;
    }
    btnCC.removeAttribute('disabled');
});

// Handle field events
Spreedly.on('fieldEvent', function(name, type, activeEl, inputProperties) {
    if (type === "input") {
        if (name === "number") {
            if (inputProperties["validNumber"]) {
                Spreedly.setStyle('number', "background-color: #CDFFE6;");
                numberParent.classList.remove("is-invalid");
            } else {
                Spreedly.setStyle('number', "background-color: transparent;");
                numberParent.classList.remove("is-invalid");
                cardErrBlock.innerHTML = ``;
            }
        } else if (name === "cvv") {
            if (inputProperties["validCvv"]) {
                Spreedly.setStyle('cvv', "background-color: #CDFFE6;");
                cvvParent.classList.remove("is-invalid");
            } else {
                Spreedly.setStyle('cvv', "background-color: transparent;");
                cvvParent.classList.remove("is-invalid");
                cardErrBlock.innerHTML = ``;
            }
        }
    }
});

// Handle validation
Spreedly.on('validation', function(inputProperties) {
    if (!inputProperties["validNumber"]) {
        numberParent.classList.add("is-invalid");
        Spreedly.transferFocus("number");
        numberParent.classList.remove("is-valid");
        cardErrBlock.innerHTML = `
            <div class="alert alert-danger">
                Please enter a valid card number
            </div>
        `;
    } else if (!inputProperties["validCvv"]) {
        cvvParent.classList.add("is-invalid");
        Spreedly.transferFocus("cvv");
        cvvParent.classList.remove("is-valid");
        cardErrBlock.innerHTML = `
            <div class="alert alert-danger">
                Please enter a valid CVV number
            </div>
        `;
    } else {
        submitPaymentForm();
    }
});

// Handle payment method (card token) after successfully created
Spreedly.on('paymentMethod', function(token, pmData) {
    document.getElementById('card_token').value = token;
    createOrder();
});

// Toggle billing address visibility
function toggleBillingAddress() {
    const checkbox = document.getElementById('sameAddress');
    const billingAddressSection = document.getElementById('billingAddress');
  
    if (checkbox.checked) {
        billingAddressSection.style.display = 'none';
        clearBillingFields(); // Clear billing fields when checkbox is checked
    } else {
        billingAddressSection.style.display = 'block';
        fillBillingFields(); // Fill billing fields when checkbox is unchecked
    }
}
  
function fillBillingFields() {
    document.getElementById('id_billing_first_name').value = document.getElementById('id_first_name').value;
    document.getElementById('id_billing_last_name').value = document.getElementById('id_last_name').value;
    document.getElementById('id_billing_address_line3').value = document.getElementById('id_shipping_address_line4').value;
    document.getElementById('id_billing_city').value = document.getElementById('id_shipping_city').value;
    document.getElementById('id_billing_state').value = document.getElementById('id_shipping_state').value;
    document.getElementById('id_billing_postcode').value = document.getElementById('id_shipping_postcode').value;
    document.getElementById('id_billing_country').value = document.getElementById('id_shipping_country').value;
}
  
function clearBillingFields() {
    document.getElementById('id_billing_first_name').value = '';
    document.getElementById('id_billing_last_name').value = '';
    document.getElementById('id_billing_address_line3').value = '';
    document.getElementById('id_billing_city').value = '';
    document.getElementById('id_billing_state').value = '';
    document.getElementById('id_billing_postcode').value = '';
    document.getElementById('id_billing_country').value = 'US'; // Default value
}
  
// Initialize correct state on page load
window.onload = function() {
    toggleBillingAddress();
};
