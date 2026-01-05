import { app, initializeApp } from '../server/index';

export default async function handler(req: any, res: any) {
    await initializeApp();
    app(req, res);
}
