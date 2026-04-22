import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
beforeAll(cleanDataBase);

async function cleanDataBase() {
  await database.query("drop schema public cascade; create schema public;");
}
describe("DELETE /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Cannot use this method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      expect(Object.prototype.hasOwnProperty.call(responseBody, "error")).toBe(
        true,
      );
    });
  });
});
