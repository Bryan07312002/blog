import { IncomingMessage, ServerResponse } from "http";
import { Handler } from "../server";

export interface Controller {
    handler: Handler;
}

export class Register implements Controller {
    handler(req: IncomingMessage, res: ServerResponse) {}
}
