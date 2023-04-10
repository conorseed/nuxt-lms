import stripe from './stripe';
import { PrismaClient } from '@prisma/client';

type PaymentIntent = {
  id: string;
};

const prisma = new PrismaClient();
const STRIPE_WEBHOOK_SECRET = useRuntimeConfig().stripe.webhookSecret;

export default defineEventHandler(async (event) => {
  const signature = getHeader(event, 'stripe-signature');
  const body = await readRawBody(event);

  if (!signature || !body) {
    console.error('No signature or body');
    throw createError({
      statusCode: 400,
      statusMessage: 'No signature or body',
    });
  }

  // verify the webhook signature
  let stripeEvent;
  try {
    stripeEvent = await stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Signature',
    });
  }

  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(stripeEvent.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(stripeEvent.data.object);
      break;
  }

  return 200;
});

async function handlePaymentIntentSucceeded(paymentIntent: PaymentIntent) {
  // verify the related course purchase
  try {
    await prisma.coursePurchase.update({
      where: {
        paymentId: paymentIntent.id,
      },
      data: {
        verified: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error verifying purchase',
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: PaymentIntent) {
  // clean up failed purchases
  try {
    await prisma.coursePurchase.delete({
      where: {
        paymentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error removing purchase',
    });
  }
}
