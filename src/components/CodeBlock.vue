<script setup>
import { computed } from "vue";
import { tokenizeCode } from "../utils/text.js";

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

const tokens = computed(() => tokenizeCode(props.source));
</script>

<template>
  <pre><code class="language-cpp"><template v-for="(token, index) in tokens" :key="`${index}-${token.value}`"><span v-if="token.className" :class="token.className">{{ token.value }}</span><template v-else>{{ token.value }}</template></template></code></pre>
</template>
