export const isLessonPagePath = (pathname = window.location.pathname) => pathname.endsWith("lesson.html");

export const getRequestedLessonId = (config, search = window.location.search) => {
  const params = new URLSearchParams(search);
  const id = params.get("id");
  return config.aliases[id] || id || "introduction-to-these-tutorials";
};

export const getLessonById = (lessonById, requestedId) => lessonById.get(requestedId) || lessonById.values().next().value;
