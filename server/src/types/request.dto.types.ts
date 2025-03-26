import { RequestHandler } from "express";

// types for our request object
// request dto - data transfer object

export type TCustomRequestHandler<P = {}, ReqB = {}, Q = {}> = RequestHandler<
  P,
  {},
  ReqB,
  Q
>;

// P - request.params
// response.body - skipped
// ReqB - request.body
// Q - request.query
