const router = require("express").Router();
const stripe = require("stripe").Stripe(process.env.STRIPE_SECRET_KEY);
// router.post("/pay", (req, res) => {
//   stripe.charges.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "usd",
//       apiKey: process.env.STRIPE_SECRET_KEY,
//     },
//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         console.log("stripeErr", stripeErr);
//         res.status(500).json(stripeErr);
//       } else {
//         console.log("stripeRes");
//         res.status(200).json(stripeRes);
//       }
//     },
//   );
// });
// module.exports = router;

router.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});
module.exports = router;
