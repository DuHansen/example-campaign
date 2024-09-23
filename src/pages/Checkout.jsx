import React, { useEffect, useState } from 'react';
import { getCampaign } from '../js/checkout';

const Checkout = () => {
    const [selectedPackage, setSelectedPackage] = useState({ name: 'Default Package', price: 20.00 });
    const [offers, setOffers] = useState([]);
    const [currency, setCurrency] = useState(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { packages, currency: apiCurrency } = await getCampaign();
                if (packages) {
                    setOffers(packages);
                    setCurrency(new Intl.NumberFormat('en-US', { style: 'currency', currency: apiCurrency }));
                } else {
                    console.error('Campanha ou pacotes não encontrados.');
                }
            } catch (error) {
                console.error('Erro ao buscar campanha:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="main pt-5">
            <div className="container">
                <div className="row">
                    <div id="block--offers" className="col-12 col-lg-6">
                        <div className="step-title">STEP 1: SELECT PACKAGE</div>
                        <hr className="mt-2" />
                        <div className="offers d-flex flex-column">
                            {offers.length > 0 ? (
                                offers.map(pkg => (
                                    <div className="offer" key={pkg.external_id}>
                                        <div className="offer-header d-flex justify-content-between align-items-center border-bottom">
                                            <div className="offer-title d-flex align-items-center px-3">
                                                <span className="offer-title-text fs-5 text-nowrap">{pkg.name}</span>
                                            </div>
                                            <div className="px-3 py-3 text-nowrap fs-7 fw-bold">
                                                <span className="shipping-cost">
                                                    {pkg.shippingPrice && Number(pkg.shippingPrice) > 0 
                                                    ? currency.format(pkg.shippingPrice) 
                                                    : 'FREE'} SHIPPING
                                                </span>
                                            </div>
                                        </div>
                                        <div className="offer-content d-flex align-items-center ps-4 py-2">
                                            <div className="offer-content-img">
                                                <img src={pkg.image} alt={pkg.name} className="img-fluid p-image" />
                                            </div>
                                            <div className="offer-content-info pe-2 ms-3">
                                                <div className="offer-content-price-each text-primary">
                                                    <span className="price-each h4 fw-bold">{currency.format(pkg.price)}</span>
                                                    <span className="fs-8 fw-light">/each</span>
                                                </div>
                                                <div className="offer-content-price-orig text-secondary">
                                                    <s>Orig {currency.format(pkg.price_retail)}</s>
                                                </div>
                                                <div className="offer-content-price-total h6 fw-bold text-success">
                                                    Total: <span className="price-total">{currency.format(pkg.price_total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>Nenhum pacote disponível.</div>
                            )}
                        </div>
                    </div>
      
      <div id="block--payment_opt1" className="col-12 col-lg-5">
            <form className="form" novalidate="novalidate">
              <input type="hidden" id="card_token" name="card_token" />
              <input type="hidden" name="payment_method" id="payment_method" />
              <input
                type="hidden"
                name="selected_package_id"
                id="selected_package_id"
              />
              <input
                type="hidden"
                name="shipping_method"
                id="shipping_method"
              />
              <input
                type="hidden"
                name="billing_same_as_shipping_address"
                id="billing_same_as_shipping_address"
                value="true"
              />
              <div className="step-title">STEP 2: CUSTOMER INFORMATION</div>
              <hr className="mt-2" />
              <div
                id="form-info"
                className="bg-white rounded-3 border p-2 p-lg-3 mb-5"
              >
                <div className="form-customer-ino">
                  <div className="row mb-3 g-2">
                    <div className="col-sm col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          name="first_name"
                          maxlength="255"
                          autocomplete="given-name"
                          className="form-control"
                          required
                          id="id_first_name"
                          placeholder="First Name"
                        />
                        <label for="id_first_name">First Name</label>
                      </div>
                      <div className="invalid-message invalid-fname"></div>
                    </div>
                    <div className="col-sm col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          name="last_name"
                          maxlength="255"
                          autocomplete="family-name"
                          className="form-control"
                          id="id_last_name"
                          placeholder="Last Name"
                        />
                        <label for="id_last_name">Last Name</label>
                      </div>
                      <div className="invalid-message invalid-lname"></div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="email"
                          placeholder="Email address"
                          name="email"
                          maxlength="254"
                          className="form-control"
                          id="id_email"
                          autocomplete="email"
                        />
                        <label for="id_email">Email</label>
                      </div>
                      <div className="invalid-message invalid-email"></div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="tel"
                          name="phone_number"
                          placeholder="Phone number"
                          autocomplete="tel"
                          className="form-control"
                          id="id_phone_number"
                          maxlength="20"
                        />
                        <label for="id_phone_number">Phone Number</label>
                      </div>
                      <div className="invalid-message invalid-ph"></div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          placeholder="Address"
                          name="shipping_address_line1"
                          maxlength="255"
                          autocomplete="address-line1"
                          className="form-control"
                          id="id_shipping_address_line1"
                        />
                        <label for="id_shipping_address_line1">Address</label>
                      </div>
                      <div
                        className="invalid-message invalid-shipping_address_line1"
                      ></div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          name="shipping_address_line4"
                          maxlength="255"
                          autocomplete="address-level2"
                          className="form-control"
                          id="id_shipping_address_line4"
                          placeholder="City"
                        />
                        <label for="id_shipping_address_line4">City</label>
                      </div>
                      <div
                        className="invalid-message invalid-shipping_address_line4"
                      ></div>
                    </div>
                    <div className="col-sm col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="shipping_state"
                          id="id_shipping_state"
                          autocomplete="address-level1"
                        >
                          <option value="">Select state</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AS">American Samoa</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="UM-81">Baker Island</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="DC">District of Columbia</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="GU">Guam</option>
                          <option value="HI">Hawaii</option>
                          <option value="UM-84">Howland Island</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="UM-86">Jarvis Island</option>
                          <option value="UM-67">Johnston Atoll</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="UM-89">Kingman Reef</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="UM-71">Midway Atoll</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="UM-76">Navassa Island</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="MP">Northern Mariana Islands</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="UM-95">Palmyra Atoll</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="PR">Puerto Rico</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UM">
                            United States Minor Outlying Islands
                          </option>
                          <option value="VI">
                            United States Virgin Islands
                          </option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="UM-79">Wake Island</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                        <label for="id_shipping_state">State</label>
                      </div>
                      <div className="invalid-message invalid-shipping_state"></div>
                    </div>
                    <div className="col-sm col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          placeholder="ZIP"
                          name="shipping_postcode"
                          maxlength="64"
                          autocomplete="postal-code"
                          className="form-control"
                          id="id_shipping_postcode"
                        />
                        <label for="id_shipping_postcode">ZIP</label>
                      </div>
                      <div
                        className="invalid-message invalid-shipping_postcode"
                      ></div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="shipping_country"
                          id="id_shipping_country"
                        >
                          <option value="US">United States</option>
                        </select>
                        <label for="id_shipping_country">Country</label>
                      </div>
                      <div
                        className="invalid-message invalid-shipping_country"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="step-title">STEP 3: PAYMENT OPTION</div>
              <hr className="mt-2" />
              <div className="checkout_express-buttons">
                <div className="d-grid mb-3">
                  <button
                    type="button"
                    className="btn btn-lg btn-express is-paypal pay-with-paypal"
                  >
                    <span className="fs-8 text-dark me-1">Pay with</span>
                    <img src="../src/img/paypal.svg" height="30px" alt="" />
                  </button>
                </div>
              </div>
              <div className="div-line fw-bold">
                OR PAY SECURELY WITH CREDIT CARD
              </div>
              <div className="bg-white rounded-3 border mb-3">
                <div id="form-cc" className="form form-cc p-2 p-lg-3">
                  <div className="row g-2 mb-3">
                    <div
                      className="col-12 d-flex justify-content-between align-items-center"
                    >
                      <h5>Credit/Debit:</h5>
                      <img src="img/creditCard.svg" alt="" className="ms-1" />
                    </div>
                    <div id="payment-error-block"></div>
                    <div className="col-12">
                      <div className="form-cc-card">
                        <div
                          id="bankcard-number"
                          className="form-control p-0"
                        ></div>
                      </div>
                      <div
                        className="invalid-message invalid-cc"
                        id="invalid-cc"
                      ></div>
                    </div>
                    <div className="col-sm col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="expiry_month"
                          id="id_expiry_month"
                          autocomplete="cc-exp-month"
                        >
                          <option value="" selected disabled>
                            Please Select
                          </option>
                          <option value="01">(01) January</option>
                          <option value="02">(02) February</option>
                          <option value="03">(03) March</option>
                          <option value="04">(04) April</option>
                          <option value="05">(05) May</option>
                          <option value="06">(06) June</option>
                          <option value="07">(07) July</option>
                          <option value="08">(08) August</option>
                          <option value="09">(09) September</option>
                          <option value="10">(10) October</option>
                          <option value="11">(11) November</option>
                          <option value="12">(12) December</option>
                        </select>
                        <label for="id_expiry_month">Month</label>
                      </div>
                    </div>
                    <div className="col-sm col-lg-12 col-xl-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          name="expiry_year"
                          id="id_expiry_year"
                          autocomplete="cc-exp-year"
                        >
                          <option value="" selected disabled>
                            Please Select
                          </option>
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                          <option value="2030">2030</option>
                          <option value="2031">2031</option>
                          <option value="2032">2032</option>
                          <option value="2033">2033</option>
                          <option value="2034">2034</option>
                          <option value="2035">2035</option>
                          <option value="2036">2036</option>
                          <option value="2037">2037</option>
                          <option value="2038">2038</option>
                          <option value="2039">2039</option>
                          <option value="2040">2040</option>
                          <option value="2041">2041</option>
                          <option value="2042">2042</option>
                        </select>
                        <label for="id_expiry_year">Year</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-cc-cvv">
                        <div id="bankcard-cvv" className="form-control p-0"></div>
                      </div>
                      <div
                        className="invalid-message invalid-cvv"
                        id="invalid-cvv"
                      ></div>
                    </div>
                  </div>

                  <div className="row" id="step-3">
                    <div className="col">
                      <div className="d-grid mb-4">
                        <button
                          id="cc-submit-button"
                          type="button"
                          className="btn btn-lg btn-success btn-checkout pay-with-cc"
                          data-loading-text="Processing"
                          data-text="Pay with Credit Card"
                          disabled
                        >
                          Pay with Credit Card
                        </button>
                      </div>
                    </div>
                    <div id="validation-error-block"></div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          </div>
          </div>
    </section>
  );
};

export default Checkout;
