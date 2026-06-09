"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de recuperação ausente ou inválido.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token inválido.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/master-admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess("Senha redefinida com sucesso! Você será redirecionado para o login...");
        setTimeout(() => {
          router.replace("/master-admin/login");
        }, 3000);
      } else {
        setError(data.message || "Erro ao redefinir senha.");
      }
    } catch {
      setLoading(false);
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <div className="master-login-wrap">
      <div className="master-login-box">
        <div className="master-login-logo" aria-hidden>
          *
        </div>
        <h1 className="master-login-title">Nova Senha</h1>
        <p className="master-login-sub">Digite sua nova senha abaixo</p>

        <form onSubmit={handleSubmit} className="master-login-form" style={{ marginTop: "24px" }}>
          {success ? (
            <div className="ml-success-msg" style={{ marginBottom: "16px", textAlign: "center" }}>
              ✓ {success}
            </div>
          ) : (
            <>
              <input
                type="password"
                className="master-input"
                placeholder="Nova senha (mínimo 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={!token}
                autoFocus
              />
              <input
                type="password"
                className="master-input"
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!token}
              />
              {error && <p className="master-error">{error}</p>}
              <button type="submit" className="master-btn-primary" disabled={loading || !token}>
                {loading ? "Redefinindo..." : "Salvar Senha"}
              </button>
            </>
          )}

          <Link href="/master-admin/login" className="ml-back-link">
            ← Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="master-login-wrap">
        <div className="master-login-box" style={{ textAlign: "center" }}>
          Carregando...
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
