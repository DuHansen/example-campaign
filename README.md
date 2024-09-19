It should be checked on page load.

When the user unchecks the checkbox the form should expand and show an additional set of form fields for the billing address, containing the same fields as the shipping address except the phone number and email fields.

If the checkbox is unchecked, these billing address fields should be required and validated before a payment can be made, as are the customer information fields. Otherwise they are hidden and not required.

If the checkbox is unchecked you need to update the spreedly required first name and last name values to come from the billing address first name, last name fields. Otherwise they are to remain as the customer information form first name, last name fields.

https://github.com/peakonedev/example-campaign/blob/main/js/form.js

If the checkbox is unchecked, the billing address form data should be captured and passed via the api in the billing address object - https://developers.29next.com/docs/api/campaigns/reference/#/operations/ordersCreate. Otherwise they are not captured and submitted.

https://github.com/peakonedev/example-campaign/blob/0923a6eb94ab4d5d32495f622fbec34f78eeffc1/js/checkout.js#L113

As a reference you can view a demo campaign here - https://offer.sellmore.co/drone-hawk/en/us/checkout.html?bar=n&exit=n
