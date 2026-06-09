const inlinePattern =
  /(#include\s+<[^>]+>;?|\bstd::[A-Za-z_]\w*(?:\s*(?:<<|>>)\s*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\d+(?:\s*[+\-*/%]\s*\d+)*|[A-Za-z_]\w*(?:\s*\{[^{}\n]*\})?|\.\.\.))+|\b(?:int|double|float|bool|char|auto)\s+[A-Za-z_]\w*\s*(?:\{[^{}\n]*\}|=\s*[^;,\n]+)?;?|\bint\s+main\(\)|\bmain\(\)|\breturn\s+\d+\s*;|[A-Za-z_]\w*\.cpp|\.[A-Za-z0-9]+|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:int|return)\b)/g;

const codePattern =
  /(\/\/.*|\/\*[\s\S]*?\*\/|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|class|concept|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|requires|return|short|signed|sizeof|static|static_assert|struct|switch|template|this|thread_local|throw|true|try|typedef|typename|union|unsigned|using|virtual|void|volatile|while)\b|\bstd::[A-Za-z_]\w*\b|\b[A-Za-z_]\w*(?=\s*\()|\b\d+(?:\.\d+)?\b|::|<<|>>|==|!=|<=|>=|&&|\|\||[{}()[\];,.+\-*/%=<>])/g;

const keywordPattern =
  /^(alignas|alignof|asm|auto|bool|break|case|catch|char|class|concept|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|requires|return|short|signed|sizeof|static|static_assert|struct|switch|template|this|thread_local|throw|true|try|typedef|typename|union|unsigned|using|virtual|void|volatile|while)$/;

export const tokenizeInlineText = (text = "") => tokenize(text, inlinePattern, () => "inline-code");

export const tokenizeCode = (source = "") => tokenize(source, codePattern, classifyCodeToken);

const tokenize = (text, pattern, classify) => {
  const tokens = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const [value] = match;
    const index = match.index || 0;

    if (index > lastIndex) {
      tokens.push({ value: text.slice(lastIndex, index), className: "" });
    }

    tokens.push({ value, className: classify(value) });
    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ value: text.slice(lastIndex), className: "" });
  }

  return tokens;
};

function classifyCodeToken(token) {
  if (token.startsWith("//") || token.startsWith("/*")) return "syntax-comment";
  if (token.startsWith("#")) return "syntax-preprocessor";
  if (token.startsWith('"') || token.startsWith("'")) return "syntax-string";
  if (/^\d/.test(token)) return "syntax-number";
  if (/^std::/.test(token)) return "syntax-namespace";
  if (keywordPattern.test(token)) return "syntax-keyword";
  if (/^[A-Za-z_]\w*$/.test(token)) return "syntax-function";
  if (/^(::|<<|>>|==|!=|<=|>=|&&|\|\||[{}()[\];,.+\-*/%=<>])$/.test(token)) return "syntax-operator";
  return "syntax-plain";
}
