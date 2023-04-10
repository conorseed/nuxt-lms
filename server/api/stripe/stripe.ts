import Stripe from 'stripe';
const config = useRuntimeConfig();
const stripe = new Stripe(config.stripe.secret, {
  apiVersion: '2022-11-15',
});

export default stripe;
