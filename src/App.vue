<script setup>
import { computed, onMounted, onUnmounted, watchEffect } from "vue";
import AppState from "./components/AppState.vue";
import HomePage from "./components/HomePage.vue";
import LessonPage from "./components/LessonPage.vue";
import SiteHeader from "./components/SiteHeader.vue";
import { useCourseData } from "./composables/useCourseData.js";
import { useSearchSuggestions } from "./composables/useSearchSuggestions.js";
import { useTheme } from "./composables/useTheme.js";
import { getConfig } from "./services/course.js";
import { getLessonById, getRequestedLessonId, isLessonPagePath } from "./services/navigation.js";

const config = getConfig();
const isLessonPage = isLessonPagePath();

const { theme, toggleTheme } = useTheme();
const { status, loadError, chapters, courseIndex, orderedLessons, searchIndex, load } = useCourseData(config);
const {
  searchQuery,
  suggestions,
  suggestionsOpen,
    hideSuggestions,
    focusSuggestions,
    scheduleHideSuggestions,
    holdSuggestions,
    resetTimer,
  } = useSearchSuggestions(searchIndex, { enabled: !isLessonPage });

const currentLesson = computed(() => {
  if (!isLessonPage || !config || status.value !== "ready") return null;
  const requestedId = getRequestedLessonId(config);
  return getLessonById(courseIndex.value.lessonById, requestedId);
});

const currentLessonId = computed(() => currentLesson.value?.id || "cpp-basics");
const currentLessonTitle = computed(() => (currentLesson.value ? "Текущий урок" : "Начать"));
const currentChapter = computed(() =>
  currentLesson.value ? courseIndex.value.chapterByNumber.get(String(currentLesson.value.chapterNumber)) : null,
);
const currentMaterial = computed(() => (currentLesson.value ? config?.lessons?.[currentLesson.value.id] : null));

const onDocumentClick = (event) => {
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (document.querySelector(".search-box")?.contains(target)) return;
  hideSuggestions();
};

watchEffect(() => {
  document.body.classList.toggle("app-data-pending", status.value !== "ready");
  document.body.setAttribute("aria-busy", status.value === "loading" ? "true" : "false");
});

watchEffect(() => {
  if (currentLesson.value) {
    document.title = `${currentLesson.value.ruTitle} | Learn C++ RU`;
    return;
  }

  if (!isLessonPage) {
    document.title = "Learn C++ RU";
  }
});

onMounted(async () => {
  document.addEventListener("click", onDocumentClick);
  await load();
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
  resetTimer();
});
</script>

<template>
  <SiteHeader
    :is-lesson-page="isLessonPage"
    :current-lesson-id="currentLessonId"
    :current-lesson-title="currentLessonTitle"
    :search-query="searchQuery"
    :suggestions="suggestions"
    :suggestions-open="suggestionsOpen"
    :is-dark-theme="theme === 'dark'"
    @toggle-theme="toggleTheme"
    @update:search-query="searchQuery = $event"
    @focus-search="focusSuggestions"
    @blur-search="scheduleHideSuggestions"
    @close-search="hideSuggestions"
    @hold-search="holdSuggestions"
  />

  <AppState v-if="status !== 'ready'" :mode="status" :error="loadError" />

  <template v-else>
    <LessonPage
      v-if="isLessonPage"
      :config="config"
      :lesson="currentLesson"
      :chapter="currentChapter"
      :material="currentMaterial"
      :chapters="chapters"
      :ordered-lessons="orderedLessons"
      :current-label="currentLesson ? `${currentLesson.number} ${currentLesson.ruTitle}` : ''"
    />
    <HomePage v-else :config="config" :chapters="chapters" :search-query="searchQuery" />
  </template>

  <footer class="site-footer">
    <div class="wrap footer-grid">
      <p v-if="isLessonPage">
        Материал страницы — пример локализации. Для полного перевода добавьте
        разрешенные тексты в <code>scripts/content.js</code>.
      </p>
      <p v-else>
        Learn C++ RU — независимая локализационная оболочка. Оригинальный сайт:
        <a href="https://www.learncpp.com/" rel="noreferrer">learncpp.com</a>.
      </p>
      <p v-if="!isLessonPage">Тексты можно заменить через <code>scripts/content.js</code>.</p>
    </div>
  </footer>
</template>
