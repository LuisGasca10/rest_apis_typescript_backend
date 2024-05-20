import express from "express";
import colors from "colors";
import cors, { type CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import productsRouter from "./router";
import db from "./config/db";
import swaggerSpec from "./config/swagger";

//Conexion a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.blue("Conectado a la base de datos"));
  } catch (error) {
    console.log(error);
    console.log(
      colors.red.bold("Hubo un error al conectar a la base de datos")
    );
  }
}

connectDB();

//instancia de express
const server = express();

//Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));
// Leer dadtos de formulario
server.use(express.json());

server.use(morgan("dev"));

//Routing configuration
server.use("/api/products", productsRouter);

// Docs
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default server;
