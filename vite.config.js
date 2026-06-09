import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { copyFileSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const courseDataPlugin = () => {
  const fileName = "learncpp-toc.ru.json";
  const source = path.resolve(fileName);
  const output = path.resolve("dist", fileName);

  return {
    name: "course-data",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== `/${fileName}`) {
          next();
          return;
        }

        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(readFileSync(source));
      });
    },
    async closeBundle() {
      await mkdir(path.dirname(output), { recursive: true });
      copyFileSync(source, output);
    },
  };
};

export default defineConfig({
  plugins: [vue(), courseDataPlugin()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        lesson: "lesson.html",
      },
    },
  },
});
