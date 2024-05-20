import { Router } from "express";
import {
  creaeteProduct,
  deleteProduct,
  getProductByID,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/products";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

export const router = Router();

/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The product name
 *                      example: Monitor curvo
 *
 *                  price:
 *                      type: integer
 *                      description: The Product price
 *                      example: 300
 *
 *                  availability:
 *                      type: boolean
 *                      description: The product availability
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of Products
 *          tags:
 *              - Products
 *          description: Return a list of Products
 *          responses:
 *                 200:
 *                     description: Sucessfull response
 *                     content:
 *                          application/json:
 *                              schema:
 *                                  type: array
 *                                  items:
 *                                   $ref: '#/components/schemas/Product'
 */

router.get("/", getProducts);

/**
 * @swagger
 * /api/products/:id:
 *      get:
 *          summary: Get a Product by ID
 *          tags:
 *              - Products
 *          description: Return a single Product
 *          parameters:
 *              - in: path
 *                name: id
 *                description: The ID of the Product to retrieve
 *                required: true
 *                schema:
 *                    type: integer
 *          responses:
 *              200:
 *                  description: Successfull response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: not found
 *
 *              400:
 *                  description: Bad request - invalid ID
 *
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  handleInputErrors,
  getProductByID
);

/**
 * @swagger
 * api/products:
 *  post:
 *      summary: Creates a new Product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                               type: string
 *                               example: "Monitor Curvo"
 *                          price:
 *                               type: number
 *                               example: 399
 *
 *      responses:
 *          201:
 *              description: Product created successfully
 *          400:
 *              description: Bad request - invalid input data
 *
 */

router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("El nombre del propducto no pudde ir vacion"),
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del propducto no pudde ir vacion")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  handleInputErrors,
  creaeteProduct
);

router.put(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre del propducto no pudde ir vacion"),
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del propducto no pudde ir vacion")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  body("availability")
    .isBoolean()
    .withMessage("El valor para la disponibilidad no válido"),
  handleInputErrors,
  updateProduct
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  handleInputErrors,
  updateAvailability
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("Id no valido"),
  handleInputErrors,
  deleteProduct
);

export default router;
