import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  test("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);

    expect(response.statusCode).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  test("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo - Testing",
      price: 0,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.statusCode).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  test("should validate that the price is a number and greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo - Testing",
      price: "Hola",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.statusCode).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  test("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "PS5 - Testing",
      price: 600,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("data");

    expect(response.statusCode).not.toBe(404);
    expect(response.statusCode).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  test("should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });

  test("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  test("Should return a 404 response for a non-existent product", async () => {
    const productID = 2000;

    const response = await request(server).get(`/api/products/${productID}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product not found");
  });

  test("Should check a valid ID in the url", async () => {
    const response = await request(server).get(`/api/products/not-valid-url`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  test("GET a Json response for a single product", async () => {
    const response = await request(server).get(`/api/products/1`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  test("Should check a valid ID in the url", async () => {
    const response = await request(server)
      .put(`/api/products/not-valid-url`)
      .send({
        name: "Test",
        price: 3300,
        availability: true,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  test("should display validation error messages when updating a product", async () => {
    const response = await request(server).put("/api/products/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should validate that the price is greather than 0", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Test",
      price: -300,
      availability: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Precio no valido");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should return 404 response for non-existing product", async () => {
    const productID = 2000;
    const response = await request(server)
      .put(`/api/products/${productID}`)
      .send({
        name: "Test",
        price: 300,
        availability: true,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("should update an existing product with valid data", async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: "Test",
      price: 300,
      availability: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("erros");
  });
});

describe("PATCH api/products/:id", () => {
  test("SHould check a valid ID in the url", async () => {
    const response = await request(server).patch(`/api/products/Hob`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  test("Should return a 404 response for a not-existing product", async () => {
    const pruductID = 2000;

    const response = await request(server).patch(`/api/products/${pruductID}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  test("Shoul update the product availability", async () => {
    const response = await request(server).patch(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/products/:id", () => {
  test("Should check a valid ID in the url", async () => {
    const response = await request(server).delete(
      `/api/products/not-valid-url`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Id no valido");
  });

  test("Should retunr a 404 response for non-existent products", async () => {
    const idProduct = 2000;

    const response = await request(server).delete(`/api/products/${idProduct}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product not found");

    expect(response.status).not.toBe(200);
  });

  test("Should delete a product", async () => {
    const response = await request(server).delete(`/api/products/1`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("Prducto eliminado");

    expect(response.status).not.toBe(404);
  });
});
