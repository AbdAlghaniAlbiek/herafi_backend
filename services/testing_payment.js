const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');




async function stripAcceptPayment(amount, currency) {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'usd',
    });

    // Pass the client secret to the client
    const clientSecret = paymentIntent.client_secret

    return clientSecret;
}





// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret = 'whsec_...';

// Match the raw body to content type application/json
app.post('/webhook', bodyParser.raw({
    type: 'application/json'
}), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('PaymentMethod was attached to a Customer!');
            break;
            // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({
        received: true
    });
});



const customer = await stripe.customers.create();

const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
});
const clientSecret = setupIntent.client_secret;
// Pass the client secret to the client















app.post('/pay', async (request, response) => {
    try {
        let intent;
        if (request.body.payment_method_id) {
            // Create the PaymentIntent
            intent = await stripe.paymentIntents.create({
                payment_method: request.body.payment_method_id,
                amount: 1099,
                currency: 'usd',
                confirmation_method: 'manual',
                confirm: true
            });
        } else if (request.body.payment_intent_id) {
            intent = await stripe.paymentIntents.confirm(
                request.body.payment_intent_id
            );
        }
        // Send the response to the client
        response.send(generateResponse(intent));
    } catch (e) {
        // Display error on client
        return response.send({
            error: e.message
        });
    }
});

const generateResponse = (intent) => {
    // Note that if your API version is before 2019-02-11, 'requires_action'
    // appears as 'requires_source_action'.
    if (
        intent.status === 'requires_action' &&
        intent.next_action.type === 'use_stripe_sdk'
    ) {
        // Tell the client to handle the action
        return {
            requires_action: true,
            payment_intent_client_secret: intent.client_secret
        };
    } else if (intent.status === 'succeeded') {
        // The payment didn’t need any additional actions and completed!
        // Handle post-payment fulfillment
        return {
            success: true
        };
    } else {
        // Invalid status
        return {
            error: 'Invalid PaymentIntent status'
        }
    }
};