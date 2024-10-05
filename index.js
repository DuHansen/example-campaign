const express = require('express');
const path = require('path');


const app = express();
const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/';
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/';
const authToken = 'ojQkx0qVzFFTgHGtzRIMGxwstvf5QAfndrvwukzy';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware para parsear JSON

app.get('/api', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

app.get('/api/campaign', async (req, res) => {
    try {
        const response = await fetch(campaignRetrieveURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'ojQkx0qVzFFTgHGtzRIMGxwstvf5QAfndrvwukzy'
            }
        });
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Something went wrong' });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/cart', async (req, res) => {
    const { first_name, last_name, email, lines } = req.body;

    console.log('Dados recebidos:', req.body); // Log dos dados recebidos

    if (!first_name || !last_name || !email || !lines) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const cartData = {
        user: {
            first_name,
            last_name,
            email
        },
        lines
    };

    try {
        const response = await fetch(cartsCreateURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: authToken // Use a variável de ambiente para o token
            },
            body: JSON.stringify(cartData)
        });
        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Something went wrong' });
        }

        res.json(result);
    } catch (error) {
        console.error('Erro ao criar carrinho:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/order', async (req, res) => {
    const orderData = req.body;

    try {
        const response = await fetch(ordersURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'ojQkx0qVzFFTgHGtzRIMGxwstvf5QAfndrvwukzy'
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: result });
        }

        res.json(result);
    } catch (error) {
        console.error('Erro ao criar o pedido:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});