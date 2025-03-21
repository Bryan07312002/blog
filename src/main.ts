import { App } from "./app";
import dotenv from "dotenv";

dotenv.config();

const app = App.initialize();
app.run();
