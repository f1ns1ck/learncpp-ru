<script setup>
defineProps({
  mode: {
    type: String,
    required: true,
  },
  error: {
    type: Object,
    default: null,
  },
});

const reloadPage = () => {
  window.location.reload();
};
</script>

<template>
  <main class="wrap lesson-state">
    <section
      class="lesson-state-panel"
      :class="{ 'lesson-state-error': mode === 'error' }"
      aria-live="polite"
    >
      <p class="eyebrow">{{ mode === "error" ? "Ошибка загрузки" : "Загрузка" }}</p>
      <h1>{{ mode === "error" ? "Не удалось загрузить курс" : "Подгружаем материал курса" }}</h1>
      <p>
        {{
          mode === "error"
            ? `${error?.message || "Данные курса временно недоступны."} Проверьте локальный сервер или повторите загрузку.`
            : "Загружаем разделы, уроки и подсказки оригинального текста."
        }}
      </p>

      <div v-if="mode === 'error'" class="hero-actions">
        <button class="button primary" type="button" @click="reloadPage">Повторить загрузку</button>
        <a class="button secondary" href="index.html">На главную</a>
      </div>
    </section>
  </main>
</template>
