<script setup>
defineProps({
  isLessonPage: {
    type: Boolean,
    default: false,
  },
  currentLessonId: {
    type: String,
    default: "cpp-basics",
  },
  currentLessonTitle: {
    type: String,
    default: "Текущий урок",
  },
  searchQuery: {
    type: String,
    default: "",
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
  suggestionsOpen: {
    type: Boolean,
    default: false,
  },
  isDarkTheme: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "toggle-theme",
  "update:search-query",
  "focus-search",
  "blur-search",
  "close-search",
  "hold-search",
]);
</script>

<template>
  <header class="site-header" :class="{ compact: isLessonPage }">
    <div class="wrap masthead">
      <div class="brand-group">
        <button
          class="brand-mark theme-toggle"
          type="button"
          aria-label="Переключить тему"
          :aria-pressed="isDarkTheme ? 'true' : 'false'"
          @click="emit('toggle-theme')"
        >
          C++
        </button>
        <a class="brand" href="index.html" aria-label="Learn C++ RU">
          <span>
            <strong>Learn C++ RU</strong>
            <small>Учебник C++ на русском</small>
          </span>
        </a>
      </div>

      <a v-if="isLessonPage" class="button secondary" href="index.html">К оглавлению</a>
      <label v-else class="search-box">
        <span class="visually-hidden">Поиск</span>
        <input
          id="searchInput"
          type="search"
          placeholder="Поиск по урокам"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="searchSuggestions"
          :aria-expanded="suggestionsOpen ? 'true' : 'false'"
          :value="searchQuery"
          @input="emit('update:search-query', $event.target.value)"
          @focus="emit('focus-search')"
          @blur="emit('blur-search')"
          @keydown.escape="emit('close-search')"
        />
        <div
          id="searchSuggestions"
          class="search-suggestions"
          :hidden="!suggestionsOpen"
          @pointerdown="emit('hold-search')"
        >
          <template v-if="suggestionsOpen">
            <p class="search-suggestions-label">
              {{ searchQuery.trim() ? "Подсказки по запросу" : "Быстрый старт" }}
            </p>
            <div class="search-suggestions-list">
              <a
                v-for="lesson in suggestions"
                :key="lesson.id"
                class="search-suggestion"
                :href="`lesson.html?id=${lesson.id}`"
              >
                <span class="search-suggestion-number">{{ lesson.number }}</span>
                <span class="search-suggestion-copy">
                  <strong>{{ lesson.ruTitle }}</strong>
                  <small>{{ lesson.chapterNumber }} · {{ lesson.chapterTitle }}</small>
                </span>
              </a>
            </div>
          </template>
        </div>
      </label>
    </div>

    <nav class="main-nav" aria-label="Основная навигация">
      <div class="wrap nav-scroll">
        <a href="index.html" :aria-current="!isLessonPage ? 'page' : undefined">Главная</a>
        <a href="index.html#chapters">Уроки</a>
        <a :href="`lesson.html?id=${currentLessonId}`" :aria-current="isLessonPage ? 'page' : undefined">
          {{ isLessonPage ? currentLessonTitle : "Начать" }}
        </a>
        <a v-if="!isLessonPage" href="#terms">Термины</a>
        <a href="https://www.learncpp.com/" rel="noreferrer">Оригинал</a>
      </div>
    </nav>
  </header>
</template>
