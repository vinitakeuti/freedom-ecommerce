import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";

/** POST /api/master-admin/register — create a new owner account */
export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ message: "Nome inválido (mínimo 2 caracteres)" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return NextResponse.json({ message: "E-mail inválido" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ message: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 });
    }

    const user = await createUser({ name: name.trim(), email: email.trim(), password });

    return NextResponse.json(
      { message: "Conta criada com sucesso", userId: user.id },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return NextResponse.json({ message: "Este e-mail já está em uso" }, { status: 409 });
    }
    console.error("[register] erro:", err);
    return NextResponse.json({ message: "Erro interno ao criar conta" }, { status: 500 });
  }
}
