<script setup>
import { computed } from "vue";
import { tokenizeInlineText } from "../utils/text.js";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});

const tokens = computed(() => tokenizeInlineText(props.text));
</script>

<template>
  <template v-for="(token, index) in tokens" :key="`${index}-${token.value}`">
    <span v-if="token.className" :class="token.className">{{ token.value }}</span>
    <template v-else>{{ token.value }}</template>
  </template>
</template>
