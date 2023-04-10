import { PrismaClient } from '@prisma/client';
import protectRoute from '~~/server/utils/protectRoute';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // only allow PUT PATCH or POST
  assertMethod(event, ['PUT', 'PATCH', 'POST']);
  // throw a 401 if there is no user logged in
  protectRoute(event);

  // get the route param
  const chapterSlug = event.context.params?.chapterSlug;
  const lessonSlug = event.context.params?.lessonSlug;

  // get lesson from the DB
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lesson not found',
    });
  }

  const { completed } = await readBody(event);
  const {
    user: { email: userEmail },
  } = event.context;

  return prisma.lessonProgress.upsert({
    where: {
      lessonId_userEmail: {
        lessonId: lesson.id,
        userEmail,
      },
    },
    update: {
      completed,
    },
    create: {
      completed,
      userEmail,
      Lesson: {
        connect: {
          id: lesson.id,
        },
      },
    },
  });
});
