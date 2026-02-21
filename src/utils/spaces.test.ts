import { buildPublicUrl, getSpacesConfig, sanitizeExtension } from "./spaces";

describe("spaces utils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws when required env vars are missing", () => {
    delete process.env.SPACES_ENDPOINT;
    expect(() => getSpacesConfig()).toThrow("Missing Spaces configuration");
  });

  it("builds public URL with normalized base", () => {
    const url = buildPublicUrl("pets/1/file.jpg", "https://cdn.example.com/");
    expect(url).toBe("https://cdn.example.com/pets/1/file.jpg");
  });

  it("sanitizes extensions from filenames", () => {
    expect(sanitizeExtension("photo.JPG")).toBe(".jpg");
    expect(sanitizeExtension("photo.bad.exe")).toBe(".exe");
    expect(sanitizeExtension("photo")).toBe("");
    expect(sanitizeExtension("photo.bad?name")).toBe("");
  });
});
