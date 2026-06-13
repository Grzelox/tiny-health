/**
 * @jest-environment node
 */
import { POST } from "./route";

const authMock = jest.fn();
const petCreateMock = jest.fn();
const weightCreateMock = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
}));

jest.mock("@/utils/prisma", () => ({
  withPrisma: (callback: (prisma: unknown) => unknown) =>
    callback({
      pet: { create: petCreateMock },
      weight: { create: weightCreateMock },
    }),
}));

const buildRequest = (file?: File) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  return new Request("http://localhost/api/pets/import", {
    method: "POST",
    body: formData,
  });
};

describe("POST /api/pets/import", () => {
  beforeEach(() => {
    authMock.mockReset();
    petCreateMock.mockReset();
    weightCreateMock.mockReset();
    petCreateMock.mockResolvedValue({ id: 1 });
    weightCreateMock.mockResolvedValue({ id: 1 });
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.mockResolvedValue({ userId: null });

    const response = await POST(buildRequest());
    expect(response.status).toBe(401);
  });

  it("returns 400 when no file is provided", async () => {
    authMock.mockResolvedValue({ userId: "user-id" });

    const response = await POST(buildRequest());
    expect(response.status).toBe(400);
  });

  it("returns 400 when required columns are missing", async () => {
    authMock.mockResolvedValue({ userId: "user-id" });

    const file = new File(["breed,color\nLabolatoryjna,Szara"], "pets.csv", { type: "text/csv" });
    const response = await POST(buildRequest(file));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toContain("name");
  });

  it("imports valid rows and reports errors for invalid ones", async () => {
    authMock.mockResolvedValue({ userId: "user-id" });

    const csv = [
      "name,animalType,breed,color,bornAt,weight,notes,isDead",
      "Mysza,Mysz,Standardowa,Szara,2024-01-15,35,Lubi orzechy,false",
      ",Mysz,,,2024-01-15,,,false",
      "Burek,Pies,,,2099-01-01,,,false",
    ].join("\n");
    const file = new File([csv], "pets.csv", { type: "text/csv" });

    const response = await POST(buildRequest(file));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.imported).toBe(1);
    expect(body.failed).toBe(2);
    expect(petCreateMock).toHaveBeenCalledTimes(1);
    expect(weightCreateMock).toHaveBeenCalledTimes(1);

    expect(body.results[0]).toMatchObject({ row: 2, name: "Mysza", status: "created" });
    expect(body.results[1]).toMatchObject({ row: 3, status: "error" });
    expect(body.results[2]).toMatchObject({ row: 4, name: "Burek", status: "error" });
  });
});
