<script setup>
import { computed } from "vue";
import InlineText from "./InlineText.vue";
import LocalizedText from "./LocalizedText.vue";
import MaterialSections from "./MaterialSections.vue";
import { makeLessonDraft } from "../services/course.js";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  lesson: {
    type: Object,
    required: true,
  },
  chapter: {
    type: Object,
    default: null,
  },
  material: {
    type: Object,
    default: null,
  },
  chapters: {
    type: Array,
    required: true,
  },
  orderedLessons: {
    type: Array,
    required: true,
  },
  currentLabel: {
    type: String,
    default: "",
  },
});

const draftSections = computed(() => {
  if (props.material) return [];
  return makeLessonDraft(
    props.config,
    props.lesson,
    props.chapter || { ruTitle: props.lesson.chapterTitle, title: props.lesson.chapterOriginalTitle },
  );
});

const currentIndex = computed(() => props.orderedLessons.findIndex((item) => item.id === props.lesson.id));
const prevLesson = computed(() => props.orderedLessons[currentIndex.value - 1]);
const nextLesson = computed(() => props.orderedLessons[currentIndex.value + 1]);
</script>

<template>
  <main class="wrap lesson-layout">
    <aside class="sidebar lesson-sidebar" aria-label="Уроки раздела">
      <details class="lesson-sidebar-panel" open>
        <summary class="lesson-sidebar-summary">
          <span>
            <strong>Уроки курса</strong>
            <small>{{ currentLabel }}</small>
          </span>
        </summary>

        <div class="lesson-nav">
          <details
            v-for="navChapter in chapters"
            :key="navChapter.number"
            class="lesson-nav-group"
            :class="{ 'is-current': navChapter.lessons.some((item) => item.id === lesson.id) }"
            :open="navChapter.lessons.some((item) => item.id === lesson.id)"
          >
            <summary class="lesson-nav-summary">
              <span class="lesson-nav-title">
                <LocalizedText :ru="navChapter.ruTitle" :original="navChapter.title" />
              </span>
              <span class="lesson-nav-meta">{{ navChapter.lessons.length }} уроков</span>
            </summary>

            <div class="lesson-list compact">
              <a
                v-for="navLesson in navChapter.lessons"
                :key="navLesson.id"
                class="lesson-link"
                :href="`lesson.html?id=${navLesson.id}`"
                :aria-current="navLesson.id === lesson.id ? 'page' : undefined"
              >
                <span class="lesson-number">{{ navLesson.number }}</span>
                <span>
                  <LocalizedText :ru="navLesson.ruTitle" :original="navLesson.title" />
                </span>
              </a>
            </div>
          </details>
        </div>
      </details>
    </aside>

    <article class="lesson-article" aria-live="polite">
      <header>
        <p class="eyebrow">Глава {{ lesson.chapterNumber }}</p>
        <h1>
          <LocalizedText :ru="lesson.ruTitle" :original="lesson.title" />
        </h1>
        <p class="lesson-meta">
          {{ chapter?.ruTitle || lesson.chapterTitle }} · {{ lesson.title }} ·
          <span class="lesson-status pill">{{ material?.status || lesson.status || "В переводе" }}</span>
          ·
          <a :href="lesson.url" rel="noreferrer" target="_blank">Открыть оригинал</a>
        </p>
      </header>

      <template v-if="material">
        <p v-if="material.intro">
          <InlineText :text="material.intro" />
        </p>
        <MaterialSections :sections="material.sections || []" />
      </template>

      <template v-else>
        <template v-for="section in draftSections" :key="section.heading">
          <h2>{{ section.heading }}</h2>
          <p><InlineText :text="section.body" /></p>
        </template>
        <p class="callout">
          Полный текст перевода можно вносить по урокам, не меняя русскую структуру сайта и подсказки оригинала.
        </p>
      </template>

      <nav v-if="prevLesson || nextLesson" class="lesson-pagination" aria-label="Навигация по урокам">
        <a v-if="prevLesson" class="lesson-page-link prev" :href="`lesson.html?id=${prevLesson.id}`">
          <span class="lesson-page-link-label">Предыдущий урок</span>
          <span class="lesson-page-link-meta">{{ prevLesson.number }}</span>
          <strong>
            <LocalizedText :ru="prevLesson.ruTitle" :original="prevLesson.title" />
          </strong>
        </a>

        <a v-if="nextLesson" class="lesson-page-link next" :href="`lesson.html?id=${nextLesson.id}`">
          <span class="lesson-page-link-label">Следующий урок</span>
          <span class="lesson-page-link-meta">{{ nextLesson.number }}</span>
          <strong>
            <LocalizedText :ru="nextLesson.ruTitle" :original="nextLesson.title" />
          </strong>
        </a>
      </nav>
    </article>
  </main>
</template>
