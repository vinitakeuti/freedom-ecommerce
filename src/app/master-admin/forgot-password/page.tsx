"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/master-admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setSuccess("Link de recuperação enviado com sucesso para o seu e-mail!");
        setEmail("");
      } else {
        setError(data.message || "Erro ao solicitar recuperação.");
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
          ?
        </div>
        <h1 className="master-login-title">Recuperar Senha</h1>
        <p className="master-login-sub">Digite seu e-mail cadastrado para receber o link</p>

        <form onSubmit={handleSubmit} className="master-login-form" style={{ marginTop: "24px" }}>
          {success ? (
            <div className="ml-success-msg" style={{ marginBottom: "16px", textAlign: "center" }}>
              ✓ {success}
            </div>
          ) : (
            <>
              <input
                type="email"
                className="master-input"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
              />
              {error && <p className="master-error">{error}</p>}
              <button type="submit" className="master-btn-primary" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Link"}
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
