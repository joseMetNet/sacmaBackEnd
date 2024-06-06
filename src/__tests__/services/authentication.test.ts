import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticationService } from "../services";
import { AuthenticationRepository } from "../../repositories";
import { CustomError } from "../../utils";
import { User, Employee, EmergencyContact } from "../../models";
import * as helper from "../../services/helper";
import { BuildResponse } from "../../services";
import { 
  StatusValue, 
  StatusCode, 
  RegisterRequest, 
  AuthenticationRequest } from "../../interfaces";

// Mocking the dependencies
vi.mock("../../repositories");
vi.mock("../../utils");
vi.mock("../../services/helper");
vi.mock("../../models");
vi.mock("./path/to/helper");

const authRepository = new AuthenticationRepository();
const authService = new AuthenticationService(authRepository);

describe("AuthenticationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const request: RegisterRequest = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        address: "123 Main St",
        phoneNumber: "1234567890",
        idIdentityCard: 1,
        identityCardNumber: "123456789",
        identityCardExpeditionDate: "2023-01-01",
        idIdentityCardExpeditionPlace: 1,
        idRole: 1
      };

      vi.spyOn(authRepository, "findUserByEmail").mockResolvedValueOnce(CustomError.notFound("User not found"));
      vi.spyOn(authRepository, "registerRequest").mockResolvedValueOnce(1);
      vi.spyOn(User, "create").mockResolvedValueOnce({ get: vi.fn().mockReturnValue(1) });
      vi.spyOn(helper, "createAuthToken").mockReturnValue("fake-token");
      vi.spyOn(BuildResponse, "buildSuccessResponse").mockReturnValue({
        statusCode: StatusCode.Ok,
        data: { token: "fake-token", userName: "John Doe" }
      });

      const response = await authService.register(request);

      expect(response).toEqual({
        statusCode: StatusCode.Ok,
        data: { token: "fake-token", userName: "John Doe" }
      });
    });

    it("should return an error if the user already exists", async () => {
      const request: RegisterRequest = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        address: "123 Main St",
        phoneNumber: "1234567890",
        idIdentityCard: 1,
        identityCardNumber: "123456789",
        identityCardExpeditionDate: "2023-01-01",
        idIdentityCardExpeditionPlace: 1,
        idRole: 1
      };

      vi.spyOn(authRepository, "findUserByEmail").mockResolvedValueOnce(1);
      vi.spyOn(BuildResponse, "buildErrorResponse").mockReturnValue({
        code: StatusCode.Conflict,
        status: StatusValue.Failed,
        data: { message: "User already exists" }
      });

      const response = await authService.register(request);

      expect(response).toEqual({
        statusCode: StatusCode.Conflict,
        data: { message: "User already exists" }
      });
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      const request: AuthenticationRequest = {
        email: "john.doe@example.com",
        password: "password123"
      };

      vi.spyOn(authRepository, "findUserByEmail").mockResolvedValueOnce(1);
      vi.spyOn(User, "findOne").mockResolvedValueOnce({ get: vi.fn().mockReturnValue(1) });
      vi.spyOn(helper, "createAuthToken").mockReturnValue("fake-token");
      vi.spyOn(BuildResponse, "buildSuccessResponse").mockReturnValue({
        code: StatusCode.Ok,
        status: StatusValue.Failed,
        data: { token: "fake-token", userName: "John Doe" }
      });

      const response = await authService.login(request);

      expect(response).toEqual({
        statusCode: StatusCode.Ok,
        data: { token: "fake-token", userName: "John Doe" }
      });
    });

    it("should return an error if the user is not found", async () => {
      const request: AuthenticationRequest = {
        email: "john.doe@example.com",
        password: "password123"
      };

      vi.spyOn(authRepository, "findUserByEmail").mockResolvedValueOnce(CustomError.notFound("User not found"));
      vi.spyOn(BuildResponse, "buildErrorResponse").mockReturnValue({
        code: StatusCode.NotFound,
        status: StatusValue.Failed,
        data: { message: "User not found" }
      });

      const response = await authService.login(request);

      expect(response).toEqual({
        statusCode: StatusCode.NotFound,
        data: { message: "User not found" }
      });
    });
  });
});
