import app from "../server.js";
import request from "supertest";

describe("POST /weather", () => {
  it("Quick test", () => {
    expect(1).toBe(1);
  });

  it("Should return city name and temperature when city is found", async () => {
    const response = await request(app)
      .post("/weather")
      .send({ cityName: "Istanbul" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("weatherText");
    expect(response.body.weatherText).toContain("Istanbul");
  });

  it("Should return error message when city is not found", async () => {
    const response = await request(app)
      .post("/weather")
      .send({ cityName: "UnknownCity" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("weatherText", "City is not found!");
  });

  it("Should return error message when no city name is provided", async () => {
    const response = await request(app).post("/weather").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "There is no city name");
  });
});
