import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ message: "Token inválido" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ message: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 });
    }

    // 1. Procurar token no banco
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 400 });
    }

    // 2. Verificar expiração
    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ message: "Token expirado" }, { status: 400 });
    }

    // 3. Atualizar senha do usuário
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    // 4. Apagar token utilizado
    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("[reset-password] erro:", err);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
