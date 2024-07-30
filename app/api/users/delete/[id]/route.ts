import { NextRequest } from "next/server";
import { userService } from "../../mockUserService";

export async function DELETE(req: NextRequest, { params }: any) {
  userService.delete(params.id);

  return Response.json(null, { status: 200 });
}
