<script setup>
import CodeBlock from "./CodeBlock.vue";
import InlineText from "./InlineText.vue";

defineProps({
  sections: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <template v-for="section in sections" :key="section.heading">
    <h2>{{ section.heading }}</h2>

    <p v-for="paragraph in section.paragraphs" :key="paragraph">
      <InlineText :text="paragraph" />
    </p>

    <ul v-if="section.bullets">
      <li v-for="item in section.bullets" :key="item">
        <InlineText :text="item" />
      </li>
    </ul>

    <ol v-if="section.steps" class="practice-list">
      <li v-for="(item, index) in section.steps" :key="item">
        <span class="practice-marker">{{ index + 1 }}</span>
        <span><InlineText :text="item" /></span>
      </li>
    </ol>

    <CodeBlock v-if="section.code" :source="section.code" />

    <details v-if="section.answers" class="answer-list">
      <summary>
        <span class="answer-summary-copy">
          <span class="answer-title">Ответы: </span>
          <span class="answer-count">{{ section.answers.length }} ответов</span>
        </span>
      </summary>

      <ol class="answer-rows">
        <li v-for="item in section.answers" :key="`${item.question}-${item.answer}`">
          <p class="answer-question">
            <InlineText :text="item.question" />
          </p>
          <p class="answer-body">
            <InlineText :text="item.answer" />
          </p>
        </li>
      </ol>
    </details>

    <aside v-if="section.callout" class="callout">
      <strong>Важно</strong>
      <span><InlineText :text="section.callout" /></span>
    </aside>
  </template>
</template>
