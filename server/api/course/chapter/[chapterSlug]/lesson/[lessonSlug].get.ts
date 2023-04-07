import { PrismaClient } from '@prisma/client';
import protectRoute from '~~/server/utils/protectRoute';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const chapterSlug = event.context.params?.chapterSlug;
  const lessonSlug = event.context.params?.lessonSlug;

  // allow first chapter. Otherwise require logged in
  if (event.context.params?.chapterSlug !== '1-chapter-1') {
    protectRoute(event);
  }

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

  return {
    ...lesson,
    path: `/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  };
});
