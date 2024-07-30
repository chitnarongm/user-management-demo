import { NextRequest } from "next/server";
import { userService } from "../mockUserService";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  userService.update(body);

  return Response.json(null, { status: 200 });
}
