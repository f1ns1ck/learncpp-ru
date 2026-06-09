<script setup>
import { computed } from "vue";
import LocalizedText from "./LocalizedText.vue";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  chapters: {
    type: Array,
    required: true,
  },
  searchQuery: {
    type: String,
    default: "",
  },
});

const chaptersByNumber = computed(() => new Map(props.chapters.map((chapter) => [String(chapter.number), chapter])));

const visibleChapters = computed(() => {
  const query = props.searchQuery.trim().toLowerCase();
  if (!query) return props.chapters;

  return props.chapters.filter((chapter) => {
    const text = [
      chapter.title,
      chapter.ruTitle,
      ...chapter.lessons.flatMap((lesson) => [lesson.title, lesson.ruTitle]),
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(query);
  });
});

const groups = computed(() =>
  (props.config.studyGroups || [])
    .map((group) => ({
      ...group,
      resolvedChapters: group.chapters
        .map((number) => chaptersByNumber.value.get(String(number)))
        .filter((chapter) => chapter && visibleChapters.value.includes(chapter)),
    }))
    .filter((group) => group.resolvedChapters.length),
);
</script>

<template>
  <main>
    <section class="intro-band">
      <div class="wrap intro-grid">
        <div class="intro-copy">
          <h1>
            Русская версия учебника с подсказками
            <LocalizedText ru="оригинального текста" original="original wording" />
          </h1>
          <p>
            Эта локальная версия повторяет учебный формат: разделы, уроки,
            навигация по главам, кодовые примеры и подсказки с английскими
            терминами. Контент написан заново и готов к замене на материалы,
            которые у вас есть право переводить.
          </p>
          <div class="hero-actions" aria-label="Быстрые действия">
            <a class="button primary" href="lesson.html?id=cpp-basics">Открыть урок</a>
            <a class="button secondary" href="#chapters">Смотреть разделы</a>
          </div>
        </div>

        <div class="code-visual" aria-label="Пример кода C++">
          <div class="window-bar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <pre><code><span class="muted">#include</span> &lt;iostream&gt;

<span class="accent">int</span> main()
{
    std::cout &lt;&lt; <span class="string">"Привет, C++!"</span>;
    <span class="accent">return</span> 0;
}</code></pre>
        </div>
      </div>
    </section>

    <section class="wrap content-layout" id="chapters">
      <aside class="sidebar" aria-label="Навигация по сайту">
        <h2>Навигация</h2>
        <a href="#chapters">Все разделы</a>
        <a href="lesson.html?id=cpp-basics">Первый урок</a>
        <a href="#terms">Словарь</a>
        <a href="https://www.learncpp.com/" rel="noreferrer">learncpp.com</a>
      </aside>

      <div class="main-column">
        <section class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Оглавление</p>
              <h2>Разделы курса</h2>
            </div>
            <span class="result-count">{{ visibleChapters.length }} из {{ chapters.length }} глав</span>
          </div>

          <div class="chapter-grid" aria-live="polite">
            <section v-for="group in groups" :key="group.id" class="study-group">
              <header class="study-group-header">
                <h3>
                  <LocalizedText :ru="group.title" :original="group.originalTitle" />
                </h3>
                <span>{{ group.resolvedChapters.length }} глав</span>
                <p>{{ group.note }}</p>
              </header>

              <details
                v-for="chapter in group.resolvedChapters"
                :key="chapter.number"
                class="chapter-accordion"
                :open="Boolean(searchQuery)"
              >
                <summary class="chapter-summary">
                  <div class="chapter-heading">
                    <h3>
                      <span class="chapter-number">{{ chapter.number }}</span>
                      {{ " " }}
                      <LocalizedText :ru="chapter.ruTitle" :original="chapter.title" />
                    </h3>
                    <p class="chapter-meta">{{ chapter.lessons.length }} уроков</p>
                  </div>
                  <span class="chapter-chevron" aria-hidden="true"></span>
                </summary>

                <div class="lesson-list chapter-lessons">
                  <a
                    v-for="lesson in chapter.lessons"
                    :key="lesson.id"
                    class="lesson-link"
                    :href="`lesson.html?id=${lesson.id}`"
                  >
                    <span class="lesson-number">{{ lesson.number }}</span>
                    <span>
                      <LocalizedText :ru="lesson.ruTitle" :original="lesson.title" />
                    </span>
                  </a>
                </div>
              </details>
            </section>
          </div>
        </section>

        <section class="panel" id="terms">
          <p class="eyebrow">Термины</p>
          <h2>Короткий словарь</h2>
          <div class="term-grid">
            <div v-for="([ru, original], index) in config.terms" :key="`${original}-${index}`" class="term-item">
              <strong>
                <LocalizedText :ru="ru" :original="original" />
              </strong>
              <span>{{ original }}</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
