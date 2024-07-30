import { NextRequest } from "next/server";
import { userService } from "../mockUserService";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  userService.create(body);

  return Response.json(null, { status: 200 });
}
