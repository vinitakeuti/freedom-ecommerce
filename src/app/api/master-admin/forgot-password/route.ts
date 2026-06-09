import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "E-mail inválido" }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: emailNorm },
    });

    if (!user) {
      // Retorna sucesso para evitar enumeração de e-mails
      return NextResponse.json({ message: "Se a conta existir, um e-mail com instruções foi enviado." });
    }

    // 2. Gerar token seguro
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validade

    // 3. Salvar no banco
    await prisma.passwordResetToken.create({
      data: {
        email: emailNorm,
        token,
        expiresAt,
      },
    });

    // 4. Enviar e-mail
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    const resetUrl = `${protocol}://${host}/master-admin/reset-password?token=${token}`;

    const mailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #6366f1; text-align: center;">EcomFreedom</h2>
        <p>Olá, <strong>${user.name}</strong>,</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta de owner de loja.</p>
        <p>Para prosseguir com a redefinição, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
        </div>
        <p style="color: #666; font-size: 0.9em;">Este link é válido por <strong>1 hora</strong>.</p>
        <p style="color: #999; font-size: 0.8em;">Se você não solicitou a alteração de senha, ignore este e-mail.</p>
      </div>
    `;

    await sendMail(emailNorm, "Recuperação de Senha — EcomFreedom", mailHtml);

    return NextResponse.json({ message: "Se a conta existir, um e-mail com instruções foi enviado." });
  } catch (err) {
    console.error("[forgot-password] erro:", err);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
