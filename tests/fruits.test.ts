import app from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";

const server = supertest(app);

describe("POST /fruits", () => {
  it("should return 201 when inserting a fruit", async () => {
    const result = await server
      .post("/fruits")
      .send({ name: "Banana", price: 200 });
    expect(result.status).toBe(httpStatus.CREATED);
  });
  it("should return 409 when inserting a fruit that is already registered", async () => {
    const result = await server
      .post("/fruits")
      .send({ name: "Banana", price: 200 });
    expect(result.status).toBe(httpStatus.CONFLICT);
  });
  it("should return 422 when inserting a fruit with data missing", async () => {
    const result = await server.post("/fruits").send({ name: "Apple" });
    expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
});

describe("GET /fruits/:id", () => {
  it("shoud return 404 when trying to get a fruit that doesn't exists", async () => {
    const result = await server.get("/fruits/1000");
    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
  it("should return 400 when id param is not valid", async () => {
    const result = await server.get("/fruits/invalid");
    expect(result.status).toBe(httpStatus.BAD_REQUEST);
  });
  it("should return a fruit given an id", async () => {
    const result = await server.get("/fruits/1");
    expect(result.body).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });
});

describe("GET /fruits", () => {
  it("should return a fruit given an id", async () => {
    const result = await server.get("/fruits");
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ])
    );
  });
});
