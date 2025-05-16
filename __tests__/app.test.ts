import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("App configuration", () => {
  describe("Express and Middleware functions", () => {
    it("should define express and middleware application with correct", () => {
      expect(app).toBeDefined();
      expect(typeof app.use).toBe("function");
    });
  });

  describe("GET /health", () => {
    it("should GET from /health endpoint", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        status: "OK",
        message: "Server is healthy",
        details: null,
      });
    });
  });
});
