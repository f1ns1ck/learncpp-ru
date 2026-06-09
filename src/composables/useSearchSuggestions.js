import { computed, ref, unref } from "vue";

export function useSearchSuggestions(searchIndex, options = {}) {
  const searchQuery = ref("");
  const searchFocused = ref(false);
  const searchHideTimer = ref(0);
  const enabled = options.enabled ?? true;

  const suggestions = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return (query
      ? searchIndex.value.filter((lesson) => lesson.searchText.includes(query))
      : searchIndex.value
    ).slice(0, query ? 8 : 6);
  });

  const suggestionsOpen = computed(() => unref(enabled) && searchFocused.value && suggestions.value.length > 0);

  const hideSuggestions = () => {
    searchFocused.value = false;
  };

  const focusSuggestions = () => {
    searchFocused.value = true;
  };

  const scheduleHideSuggestions = () => {
    window.clearTimeout(searchHideTimer.value);
    searchHideTimer.value = window.setTimeout(hideSuggestions, 140);
  };

  const holdSuggestions = () => {
    window.clearTimeout(searchHideTimer.value);
  };

  const resetTimer = () => {
    window.clearTimeout(searchHideTimer.value);
  };

  return {
    searchQuery,
    suggestions,
    suggestionsOpen,
    hideSuggestions,
    focusSuggestions,
    scheduleHideSuggestions,
    holdSuggestions,
    resetTimer,
  };
}
