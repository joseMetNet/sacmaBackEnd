import { expect, vi } from "vitest";
import { AuthenticationRepository } from "../../repositories/index";
import { CustomError } from "../../utils";
import { describe, it, beforeEach } from "vitest";


describe("AuthenticationRepository", () => {
  let repository: AuthenticationRepository;

  beforeEach(() => {
    // Reset fetch mocks before each test
    vi.resetAllMocks();
    // Create a new instance of the repository
    repository = new AuthenticationRepository();
    // Mock environment configuration
    vi.mock("../../config", () => ({
      EnvConfig: {
        AUTH_URL: "https://example.com",
        USER_GROUP: "testGroup",
      },
    }));

  });

  it("should find user by email", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ id: 1 }] }),
    });
    global.fetch = mockFetch;

    const userId = await repository.findUserByEmail("mail@mail.com");
    console.log(userId);
    expect(userId).toBe(1);
  });

  it("should return error if user is not found", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    global.fetch = mockFetch;

    const result = await repository.findUserByEmail("mail@mail.com");
    expect(result).toBeInstanceOf(CustomError);
    expect((result as CustomError).message).toBe("User not found");
  });

  it("should change user password", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ message: "Password changed" }),
    });
    global.fetch = mockFetch;

    const response = await repository.changePassword({ email: "mail@mail.com", password: "newPassword" });
    expect(response).toBe("Password changed");
  });

  it("should return error if password change fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => ({}),
    });
    global.fetch = mockFetch;

    const result = await repository.changePassword({ email: "mail@mail.com", password: "newPassword" });
    expect(result).toBeInstanceOf(CustomError);
    expect((result as CustomError).message).toBe("Password could not be changed");
  });

  it("should authenticate user", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ data: { id: 1 } }),
    });
    global.fetch = mockFetch;

    const userId = await repository.authenticationRequest({ email: "mail@mail.com", password: "password" });
    expect(userId).toBe(1);
  });

  it("should return error if authentication fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => ({}),
    });
    global.fetch = mockFetch;

    const result = await repository.authenticationRequest({ email: "mail@mail.com", password: "password" });
    expect(result).toBeInstanceOf(CustomError);
    expect((result as CustomError).message).toBe("Login failed");
  });

  it("should register user", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ data: [{ id: 1 }] }),
    });
    global.fetch = mockFetch;

    const userId = await repository.registerRequest({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      address: "123 Main St",
      phoneNumber: "+1234567890",
      idIdentityCard: 1,
      identityCardNumber: "A12345678",
      identityCardExpeditionDate: "2023-01-01",
      idIdentityCardExpeditionPlace: 1,
      idRole: 2,
    });
    expect(userId).toBe(1);
  });

  it("should return error if registration fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 500,
      json: async () => ({}),
    });
    global.fetch = mockFetch;

    const result = await repository.registerRequest({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      address: "123 Main St",
      phoneNumber: "+1234567890",
      idIdentityCard: 1,
      identityCardNumber: "A12345678",
      identityCardExpeditionDate: "2023-01-01",
      idIdentityCardExpeditionPlace: 1,
      idRole: 2,
    });
    expect(result).toBeInstanceOf(CustomError);
    expect((result as CustomError).message).toBe("Registration failed");
  });
});
