import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const authenticateAccountBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateAccountBodySchema = z.infer<
  typeof authenticateAccountBodySchema
>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateAccountBodySchema))
  async handle(@Body() body: AuthenticateAccountBodySchema) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("User credentials are invalid");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("User credentials are invalid");
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
