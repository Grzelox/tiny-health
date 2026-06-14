import "@testing-library/jest-dom";

// Provide a lightweight (Polish) translator in tests so components that use
// next-intl render their actual copy without needing the full provider tree.
jest.mock("next-intl", () => {
  const messages = require("../messages/pl.json");

  const resolve = (namespace: string | undefined, key: string) => {
    const path = namespace ? `${namespace}.${key}` : key;
    return path.split(".").reduce<any>((acc, part) => (acc == null ? acc : acc[part]), messages);
  };

  const makeTranslator = (namespace?: string) => {
    const translate = (key: string, values?: Record<string, unknown>) => {
      const value = resolve(namespace, key);
      if (typeof value !== "string") {
        return namespace ? `${namespace}.${key}` : key;
      }
      if (!values) return value;
      return value.replace(/\{(\w+)\}/g, (_match, name) =>
        values[name] != null ? String(values[name]) : `{${name}}`,
      );
    };
    translate.rich = (key: string, values?: Record<string, unknown>) => translate(key, values);
    translate.markup = (key: string, values?: Record<string, unknown>) => translate(key, values);
    translate.raw = (key: string) => resolve(namespace, key);
    translate.has = (key: string) => resolve(namespace, key) != null;
    return translate;
  };

  return {
    useTranslations: (namespace?: string) => makeTranslator(namespace),
    useLocale: () => "pl",
    useFormatter: () => ({}),
    useMessages: () => messages,
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
