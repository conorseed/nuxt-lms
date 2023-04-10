import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

const lessonSelect = Prisma.validator<Prisma.LessonArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
  },
});
export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect> & {
  path: string;
};

const chapterSelect = Prisma.validator<Prisma.ChapterArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});
export type ChapterOutline = Omit<
  Prisma.ChapterGetPayload<typeof chapterSelect>,
  'lessons'
> & {
  lessons: LessonOutline[];
};

const courseSelect = Prisma.validator<Prisma.CourseArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});
export type CourseOutline = Omit<
  Prisma.CourseGetPayload<typeof courseSelect>,
  'chapters'
> & {
  chapters: ChapterOutline[];
};

export default defineEventHandler(async (event) => {
  let outline;

  try {
    outline = await prisma.course.findFirst(courseSelect);
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database error',
    });
  }

  if (!outline) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course not found',
    });
  }

  return {
    ...outline,
    chapters: outline.chapters.map((chapter) => {
      return {
        ...chapter,
        lessons: chapter.lessons.map((lesson) => {
          return {
            ...lesson,
            path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
          };
        }),
      };
    }),
  };
});
