import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // get paymentid from route
  const paymentId = event.context.params?.paymentId;
  const user = event.context._user;

  // update course purchase record
  try {
    await prisma.coursePurchase.update({
      where: {
        paymentId,
      },
      data: {
        userEmail: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error linking course purchase',
    });
  }

  return 200;
});
