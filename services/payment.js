
// stripe.customers
//   .create({
//     email: userData.stripEmail,
//     source: userData.stripToken,
//   })
//   .then((customer) =>
//     stripe.charges.create({
//       amount,
//       description: 'project name',
//       currency: 'usd',
//       customer: customer.id,
//     })
//   )
//   .then((charge) => res.render('success'));





// // Create a payment intent to start a purchase flow.
// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 2000,
//   currency: 'usd',
//   description: 'My first payment',
// });

// // Complete the payment using a test card.
// await stripe.paymentIntents.confirm(paymentIntent.id, {
//   payment_method: 'pm_card_mastercard',
// });






// const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

// const calculateOrderAmount = items => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };


// const { items } = req.body;
// // Create a PaymentIntent with the order amount and currency
// const paymentIntent = await stripe.paymentIntents.create({
//   amount: calculateOrderAmount(items),
//   currency: "usd"
// });





const stripe = require('strip')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

const onRequest = (request) => {
  // Do something.
};

// Add the event handler function:
stripe.on('request', onRequest);

// Remove the event handler function:
stripe.off('request', onRequest);



// Create a new customer and then create an invoice item then invoice it:
stripe.customers
  .create({
    email: 'customer@example.com',
  })
  .then((customer) => {
    // have access to the customer object
     stripe.invoiceItems
      .create({
        customer: customer.id, // set the customer id
        amount: 2500, // 25
        currency: 'usd',
        description: 'One-time setup fee',
      })
      .then((invoiceItem) => {
         stripe.invoices.create({
          collection_method: 'send_invoice',
          customer: invoiceItem.customer,
        });
      })
      .then((invoice) => {
        // New invoice created on a new customer
      })
      .catch((err) => {
        // Deal with an error
      });
  });


























