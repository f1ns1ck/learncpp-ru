import { computed, ref } from "vue";
import { buildCourseIndex, loadCourseData, normalizeChapters } from "../services/course.js";

export function useCourseData(config) {
  const status = ref(config ? "loading" : "error");
  const loadError = ref(config ? null : new Error("Не найдена конфигурация Learn C++ RU."));
  const courseData = ref(null);

  const chapters = computed(() => normalizeChapters(courseData.value?.chapters || []));
  const courseIndex = computed(() => buildCourseIndex(chapters.value));
  const orderedLessons = computed(() => courseIndex.value.orderedLessons);
  const searchIndex = computed(() =>
    orderedLessons.value.map((lesson) => ({
      ...lesson,
      searchText: [
        lesson.number,
        lesson.ruTitle,
        lesson.title,
        lesson.chapterNumber,
        lesson.chapterTitle,
        lesson.chapterOriginalTitle,
      ]
        .join(" ")
        .toLowerCase(),
    })),
  );

  const load = async () => {
    if (!config) return;

    try {
      courseData.value = await loadCourseData(config);
      status.value = "ready";
    } catch (error) {
      loadError.value = error instanceof Error ? error : new Error("Неизвестная ошибка загрузки данных.");
      status.value = "error";
    }
  };

  return {
    status,
    loadError,
    courseData,
    chapters,
    courseIndex,
    orderedLessons,
    searchIndex,
    load,
  };
}
