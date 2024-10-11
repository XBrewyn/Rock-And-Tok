import { Request, Response, NextFunction } from 'express';

type Router = {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
  func: (req: Request, res: Response, next: NextFunction) => void;
};

export type {
  Router
};
