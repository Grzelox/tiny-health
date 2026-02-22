/**
 * @jest-environment node
 */
import { GET } from "./route";

const authMock = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
}));

describe("GET /api/v1/files/sign", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockResolvedValue({ userId: null });

    const response = await GET(new Request("http://localhost/api/v1/files/sign"));
    expect(response.status).toBe(401);
  });

  it("returns 400 when fileId is missing", async () => {
    authMock.mockResolvedValue({ userId: "user-id" });

    const response = await GET(new Request("http://localhost/api/v1/files/sign"));
    expect(response.status).toBe(400);
  });
});
