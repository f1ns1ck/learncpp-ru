const appendixChapters = () =>
  new Map([
    ["A", { number: "A", title: "Appendix A: Miscellaneous Subjects", ruTitle: "Приложение A: разные темы", lessons: [] }],
    ["B", { number: "B", title: "Appendix B: C++ Updates", ruTitle: "Приложение B: обновления C++", lessons: [] }],
    ["C", { number: "C", title: "Appendix C: The End", ruTitle: "Приложение C: завершение", lessons: [] }],
    ["D", { number: "D", title: "Appendix D: Deprecated Articles", ruTitle: "Приложение D: устаревшие статьи", lessons: [] }],
  ]);

export const getConfig = () => window.learnCppRu || null;

export const normalizeCourseData = (sourceData) => {
  const normalized = sourceData && typeof sourceData === "object" ? sourceData : {};
  return {
    ...normalized,
    chapters: Array.isArray(normalized.chapters) ? normalized.chapters : [],
  };
};

export const normalizeChapters = (sourceChapters) => {
  const normalized = [];
  const appendices = appendixChapters();

  sourceChapters.forEach((chapter) => {
    if (chapter.number !== "28") {
      normalized.push(chapter);
      return;
    }

    normalized.push({
      ...chapter,
      lessons: chapter.lessons.filter((lesson) => lesson.number.startsWith("28.")),
    });

    chapter.lessons.forEach((lesson) => {
      const appendixKey = lesson.number.match(/^([ABC])\./)?.[1];
      if (appendixKey) {
        appendices.get(appendixKey).lessons.push(lesson);
        return;
      }

      if (/^(21|22)\./.test(lesson.number)) {
        appendices.get("D").lessons.push(lesson);
      }
    });
  });

  appendices.forEach((chapter) => {
    if (chapter.lessons.length) normalized.push(chapter);
  });

  return normalized;
};

export const buildCourseIndex = (chapters) => {
  const chapterByNumber = new Map();
  const lessonById = new Map();
  const orderedLessons = [];

  for (const chapter of chapters) {
    chapterByNumber.set(String(chapter.number), chapter);

    for (const lesson of chapter.lessons) {
      const normalizedLesson = {
        ...lesson,
        chapterNumber: chapter.number,
        chapterTitle: chapter.ruTitle,
        chapterOriginalTitle: chapter.title,
      };

      lessonById.set(lesson.id, normalizedLesson);
      orderedLessons.push(normalizedLesson);
    }
  }

  return { chapterByNumber, lessonById, orderedLessons };
};

export const getDataUrl = (config) => {
  if (window.location.protocol === "file:") {
    return `http://127.0.0.1:8123/${config.dataUrl}`;
  }

  return new URL(config.dataUrl, window.location.href).href;
};

export const fetchCourseData = async (config) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);

  let response;
  try {
    response = await fetch(getDataUrl(config), {
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Загрузка данных заняла слишком много времени.");
    }
    throw error instanceof Error ? error : new Error("Не удалось выполнить запрос данных курса.");
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${config.dataUrl}: ${response.status}`);
  }

  return normalizeCourseData(await response.json());
};

export const getEmbeddedCourseData = (config) => {
  const embeddedData = config.embeddedData || window.learnCppRuEmbeddedData;
  if (embeddedData && Array.isArray(embeddedData.chapters)) {
    return normalizeCourseData(embeddedData);
  }
  return null;
};

export const loadCourseData = async (config) => {
  try {
    return await fetchCourseData(config);
  } catch (error) {
    const embedded = getEmbeddedCourseData(config);
    if (embedded) return embedded;
    throw error instanceof Error ? error : new Error("Неизвестная ошибка загрузки данных.");
  }
};

export const makeLessonDraft = (config, lesson, chapter) =>
  config.makeLessonDraft(lesson, chapter || { ruTitle: lesson.chapterTitle, title: lesson.chapterOriginalTitle });
