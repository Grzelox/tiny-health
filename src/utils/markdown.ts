import { marked } from "marked";

const ALLOWED_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeUrl(href: string): boolean {
  try {
    return ALLOWED_URL_PROTOCOLS.has(new URL(href, "https://example.com").protocol);
  } catch {
    return false;
  }
}

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    // Raw HTML in notes is rendered as escaped text instead of being passed through.
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      if (!isSafeUrl(href)) {
        return label;
      }
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer nofollow">${label}</a>`;
    },
    image({ href, title, text }) {
      if (!isSafeUrl(href)) {
        return escapeHtml(text);
      }
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${titleAttr} />`;
    },
  },
});

export function renderNotesMarkdown(notes: string): string {
  return marked.parse(notes, { async: false });
}
