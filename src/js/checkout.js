// Importações
import axios from 'axios';
import campaign from '../js/campaign';

// Variáveis
let lineArr = [];
const formEl = document.getElementById('formEl');
const firstName = document.querySelector("#id_first_name");
const lastName = document.querySelector("#id_last_name");
const email = document.querySelector("#id_email");
const summaryShipPrice = document.querySelector('.selected-shipping-price');
const btnPaypal = document.querySelector('.pay-with-paypal');
const btnCC = document.querySelector(".pay-with-cc");

// Função para buscar a campanha
export const getCampaign = async () => {
    console.log("Buscando campanha...");
    const url = '/api/v1/campaigns/';
    const options = {
        headers: {
            Accept: 'application/json',
            Authorization: publicKey,
        },
    };

    try {
        const response = await axios.get(url, options);
        console.log("Dados da campanha recebidos:", response.data);

        // Verifica se o dado retornado é um objeto e contém os campos esperados
        const campaignData = response.data;
        
        if (!campaignData || !Array.isArray(campaignData.packages) || campaignData.packages.length === 0) {
            console.error('Campanha ou pacotes não encontrados.');
            return { packages: [], currency: 'USD' }; // Retornando valores padrão
        }

        // Renderiza os pacotes e passa a moeda também
        renderPackages(campaignData.packages, campaignData.currency);

        // Processa outros dados da campanha
        getCampaignData(campaignData);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return { packages: [], currency: 'USD' }; // Retornando valores padrão
    }
};


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

    console.log("create order");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    btnCC.disabled = true;
    btnCC.textContent = btnCC.dataset.loadingText;
    validErrBlock.innerHTML = ``

    const orderData = {
        "user": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
        },
        "lines": lineArr,

        "use_default_shipping_address": false,

        "use_default_billing_address": false,
        "billing_same_as_shipping_address": data.billing_same_as_shipping_address,
        "payment_detail": {
            "payment_method": data.payment_method,
            "card_token": data.card_token,
        },
        "shipping_address": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "line1": data.shipping_address_line1,
            "line4": data.shipping_address_line4,
            "state": data.shipping_state,
            "postcode": data.shipping_postcode,
            "phone_number": data.phone_number,
            "country": data.shipping_country
        },
        "shipping_method": data.shipping_method,
        "success_url": campaign.nextStep(nextURL)
    }


    console.log(orderData);

    try {
        const response = await fetch(ordersURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });
        const result = await response.json()

        // Some examples of error handling from the API to expand on
        if (!response.ok && result.non_field_errors) {

            btnCC.disabled = false;
            btnCC.textContent = btnCC.dataset.text;

            console.log('Something went wrong', result);
            let error = result.non_field_errors;
            validErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    ${error}
                </div>
            `;
            return;

        } else if (!response.ok && result.postcode) {

            btnCC.disabled = false;
            btnCC.textContent = btnCC.dataset.text;

            console.log('ZIP is incorrect', result);
            let error = result.postcode;
            validErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    API Response Error: ${error}
                </div>
            `;
            return;

        } else if (!response.ok && result.shipping_address) {

            btnCC.disabled = false;
            btnCC.textContent = btnCC.dataset.text;

            console.log('Phone number is not accepted', result);
            let error = result.shipping_address.phone_number;
            validErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    API Response Error: ${error}
                </div>
            `;
            return;

        } else if (!response.ok) {

            btnCC.disabled = false;
            btnCC.textContent = btnCC.dataset.text;

            console.log('Something went wrong', result);
            let error = Object.values(result)[0];
            document.getElementById("payment-error-block").innerHTML = `
                <div class="alert alert-danger">
                    ${error}
                </div>
            `;
            return;
        }

        sessionStorage.setItem('ref_id', result.ref_id);

        if (!result.payment_complete_url && result.number) {

            location.href = campaign.nextStep(nextURL);

        } else if (result.payment_complete_url) {

            window.location.href = result.payment_complete_url;
        }

    } catch (error) {
        console.log(error);
    }

}

/**
 * Use Create Order with PayPal
 */

const createPayPalOrder = async () => {
    console.log("create order paypal order");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);
    btnPaypal.disabled = true;
    const orderPPData = {
        "user": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
        },
        "lines": lineArr,
        "payment_detail": {
            "payment_method": data.payment_method,
        },
        "shipping_method": data.shipping_method,
        "success_url": campaign.nextStep(nextURL)
    }

    try {
        const response = await fetch(ordersURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderPPData),
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            console.log(orderPPData);
            btnPaypal.disabled = false;
            return;
        }

        console.log(result)

        sessionStorage.setItem('ref_id', result.ref_id);

        window.location.href = result.payment_complete_url;

    } catch (error) {
        console.log(error);
    }


}
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

const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const renderPackages = (packages, currency) => {
    const container = document.querySelector(".offers");
    if (!container) {
        console.error("Container '.offers' não encontrado");
        return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    if (!packages || packages.length === 0) {
        console.error("Nenhum pacote encontrado");
        container.textContent = "Nenhum pacote disponível.";
        return;
    }

    packages.forEach(pkg => {
        const item = document.createElement("div");
        item.classList.add('offer');
        item.dataset.packageId = pkg.ref_id || '';
        item.dataset.name = pkg.name || '';
        item.dataset.priceTotal = parseFloat(pkg.price_total) || 0; // Garantir que é um número
        item.dataset.priceEach = parseFloat(pkg.price) || 0; // Garantir que é um número
        item.dataset.priceShipping = parseFloat(pkg.shippingPrice) || 0; // Garantir que é um número
        item.dataset.shippingMethod = pkg.shippingMethod || 'Standard';

        createOfferContent(item, pkg, currency);
        fragment.appendChild(item);
    });

    container.appendChild(fragment);
    updateOfferListeners(); // Atualiza os listeners após renderizar os pacotes
};

const createOfferContent = (item, pkg, currency) => {
    const offerHeader = document.createElement('div');
    offerHeader.className = 'offer-header d-flex justify-content-between align-items-center border-bottom';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'offer-title d-flex align-items-center px-3';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'offer-title-text fs-5 text-nowrap';
    titleSpan.textContent = pkg.name;
    titleDiv.appendChild(titleSpan);

    const shippingDiv = document.createElement('div');
    shippingDiv.className = 'px-3 py-3 text-nowrap fs-7 fw-bold';
    const shippingSpan = document.createElement('span');
    shippingSpan.className = 'shipping-cost';
    shippingSpan.textContent = item.dataset.priceShipping > 0 ? formatCurrency(item.dataset.priceShipping, currency) : 'FREE';
    shippingDiv.appendChild(shippingSpan);
    shippingDiv.appendChild(document.createTextNode(' SHIPPING'));

    offerHeader.appendChild(titleDiv);
    offerHeader.appendChild(shippingDiv);
    item.appendChild(offerHeader);

    const offerContent = document.createElement('div');
    offerContent.className = 'offer-content d-flex align-items-center ps-4 py-2';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'offer-content-img';
    const img = document.createElement('img');
    img.className = 'img-fluid p-image';
    img.src = pkg.image || 'placeholder.jpg'; // Adicione um placeholder se a imagem for null
    img.alt = pkg.name;
    imgDiv.appendChild(img);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'offer-content-info pe-2 ms-3';

    const priceEachDiv = document.createElement('div');
    priceEachDiv.className = 'offer-content-price-each text-primary';
    const priceEachSpan = document.createElement('span');
    priceEachSpan.className = 'price-each h4 fw-bold';
    priceEachSpan.textContent = formatCurrency(item.dataset.priceEach, currency);
    priceEachDiv.appendChild(priceEachSpan);
    priceEachDiv.appendChild(document.createTextNode(' /each'));

    const priceOrigDiv = document.createElement('div');
    priceOrigDiv.className = 'offer-content-price-orig text-secondary';
    const priceOrigSpan = document.createElement('s');
    priceOrigSpan.innerHTML = `Orig <span class="price-each-retail">${formatCurrency(pkg.priceRetail || 0, currency)}</span>`;
    priceOrigDiv.appendChild(priceOrigSpan);

    const priceTotalDiv = document.createElement('div');
    priceTotalDiv.className = 'offer-content-price-total h6 fw-bold text-success';
    priceTotalDiv.innerHTML = `Total: <span class="price-total">${formatCurrency(item.dataset.priceTotal, currency)}</span>`;

    infoDiv.appendChild(priceEachDiv);
    infoDiv.appendChild(priceOrigDiv);
    infoDiv.appendChild(priceTotalDiv);

    offerContent.appendChild(imgDiv);
    offerContent.appendChild(infoDiv);
    item.appendChild(offerContent);
};

const calculateTotal = () => {
    const selectedPackage = document.querySelector(".offer.selected");
    if (!selectedPackage) return;

    const packagePrice = parseFloat(selectedPackage.dataset.priceTotal) || 0;
    const shippingPrice = parseFloat(selectedPackage.dataset.priceShipping) || 0;
    const checkoutTotal = packagePrice + shippingPrice;

    const orderTotal = document.querySelector(".order-summary-total-value");
    orderTotal.textContent = formatCurrency(checkoutTotal, campaign.currency);
};

// Função para atualizar a oferta selecionada
const updateSelectedOffer = (offer) => {
    const pid = offer.dataset.packageId;
    const pName = offer.dataset.name;
    const pPriceEach = offer.dataset.priceEach;
    const pPriceShipping = offer.dataset.priceShipping;

    document.getElementById('shipping_method').value = offer.dataset.shippingMethod;
    document.querySelector('.selected-product-name').textContent = pName;
    document.querySelector('.selected-product-price').textContent = formatCurrency(pPriceEach, campaign.currency);

    const summaryShipPrice = document.querySelector('.selected-shipping-price');
    summaryShipPrice.textContent = pPriceShipping > 0 ? formatCurrency(pPriceShipping, campaign.currency) : "FREE";

    lineArr[0].package_id = pid;
    console.log("Change Line Items:", lineArr);
    calculateTotal(); // Recalcula o total
};

// Inicializa e adiciona Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    const btnPaypal = document.getElementById('pay-with-paypal');
    getCampaign(); // Carrega a campanha

    // Atualiza os listeners após renderizar os pacotes
    const updateOfferListeners = () => {
        const offers = document.querySelectorAll(".offer");
        offers.forEach((offer) => {
            offer.addEventListener('click', function() {
                offers.forEach(el => el.classList.remove('selected'));
                offer.classList.add("selected");
                updateSelectedOffer(offer);
            });
        });
    };

    // Chame esta função após a renderização dos pacotes
    const renderAndSetupPackages = async () => {
        await getCampaign(); // Assegura que a campanha é carregada
        updateOfferListeners(); // Atualiza os listeners das ofertas
    };

    renderAndSetupPackages();
});
