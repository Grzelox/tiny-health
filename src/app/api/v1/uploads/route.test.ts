/**
 * @jest-environment node
 */
import { POST } from "./route";

const authMock = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
}));

describe("POST /api/v1/uploads", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockResolvedValue({ userId: null });

    const response = await POST(new Request("http://localhost/api/v1/uploads", { method: "POST" }));
    expect(response.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    authMock.mockResolvedValue({ userId: "user-id" });

    const response = await POST(
      new Request("http://localhost/api/v1/uploads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId: 1 }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
