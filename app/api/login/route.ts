import { LogInForm } from "@/typings/model";
import * as bcrypt from "bcrypt";
import { signJwtAccessToken } from "../../../lib/jwtHandler";
import { userService } from "../users/mockUserService";

export async function POST(request: Request) {
  const body: LogInForm = await request.json();
  const user = userService.find(body.email);

  try {
    if (user && (await bcrypt.compare(body.password, user.password))) {
      const { password, ...userWithoutPass } = user;
      const accessToken = signJwtAccessToken(userWithoutPass);

      const result = {
        ...userWithoutPass,
        accessToken,
      };
      return new Response(JSON.stringify(result));
    } else {
      return new Response(
        JSON.stringify({
          message: "Log In Failed with Invalid Email or Password.",
        }),
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}
