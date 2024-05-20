import { Request, Response } from "express";
import Product from "../models/Product.model";
import { validationResult } from "express-validator";

export const getProductByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({ data: product });
  } catch (error) {}
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [["id", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.json({ data: products });
  } catch (error) {}
};

export const creaeteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {}
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        error: "Product not found",
      });
    }

    await product.update(req.body);
    await product.save();

    res.json({ data: product });
  } catch (error) {}
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        error: "Product not found",
      });
    }

    const productUpadated = {
      ...product.dataValues,
      availability: !product.dataValues.availability,
    };

    await product.update(productUpadated);
    await product.save();

    res.json({ data: product });
  } catch (error) {}
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      res.status(404).json({
        error: "Product not found",
      });
    }

    await product.destroy();

    res.json({ data: "Prducto eliminado" });
  } catch (error) {}
};
