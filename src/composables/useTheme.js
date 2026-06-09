import { onMounted, ref } from "vue";

const themeStorageKey = "learncpp-theme";

export function useTheme() {
  const theme = ref("light");

  const applyTheme = (nextTheme, persist = true) => {
    theme.value = nextTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme.value;
    document.documentElement.style.colorScheme = theme.value;

    if (persist) {
      try {
        window.localStorage.setItem(themeStorageKey, theme.value);
      } catch (error) {
        // Local storage can be unavailable for local files or strict browser modes.
      }
    }
  };

  const initTheme = () => {
    let nextTheme = document.documentElement.dataset.theme;

    if (nextTheme !== "dark" && nextTheme !== "light") {
      try {
        const saved = window.localStorage.getItem(themeStorageKey);
        if (saved === "dark" || saved === "light") nextTheme = saved;
      } catch (error) {
        // Fall back to media preference.
      }
    }

    if (nextTheme !== "dark" && nextTheme !== "light") {
      nextTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    applyTheme(nextTheme, false);
  };

  const toggleTheme = () => {
    applyTheme(theme.value === "dark" ? "light" : "dark");
  };

  onMounted(initTheme);

  return {
    theme,
    toggleTheme,
  };
}
