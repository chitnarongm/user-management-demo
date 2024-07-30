// import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { userService } from "./mockUserService";

export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  return Response.json(userService.getAll(Number(params.get("limit")), Number(params.get("offset"))), { status: 200 });
}
