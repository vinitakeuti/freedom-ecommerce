"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "login" | "register";

export default function MasterLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  // ── Login ──────────────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Register ───────────────────────────────────────────────────────────────
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await fetch("/api/master-admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    setLoginLoading(false);

    if (res.ok) {
      router.replace("/master-admin/dashboard");
    } else {
      const data = await res.json();
      setLoginError(data.message || "E-mail ou senha incorretos");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regPassword !== regConfirm) {
      setRegError("As senhas não coincidem");
      return;
    }

    setRegLoading(true);

    const res = await fetch("/api/master-admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
    });

    const data = await res.json();
    setRegLoading(false);

    if (res.ok) {
      setRegDone(true);
      setTimeout(() => {
        setRegDone(false);
        setTab("login");
        setLoginEmail(regEmail);
        setRegName("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
      }, 2000);
    } else {
      setRegError(data.message || "Erro ao criar conta");
    }
  };

  return (
    <div className="master-login-wrap">
      <div className="master-login-box">
        <div className="master-login-logo" aria-hidden>
          E
        </div>
        <h1 className="master-login-title">EcomFreedom</h1>
        <p className="master-login-sub">Gerencie suas lojas em um só lugar</p>

        {/* Tabs */}
        <div className="ml-tabs">
          <button
            className={`ml-tab${tab === "login" ? " active" : ""}`}
            onClick={() => { setTab("login"); setLoginError(""); }}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`ml-tab${tab === "register" ? " active" : ""}`}
            onClick={() => { setTab("register"); setRegError(""); }}
            type="button"
          >
            Criar Conta
          </button>
        </div>

        {/* ── Login ── */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="master-login-form">
            <input
              type="email"
              className="master-input"
              placeholder="Seu e-mail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
            <input
              type="password"
              className="master-input"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {loginError && <p className="master-error">{loginError}</p>}
            <button type="submit" className="master-btn-primary" disabled={loginLoading}>
              {loginLoading ? "Verificando..." : "Acessar Painel"}
            </button>
            <Link href="/master-home" className="ml-back-link">← Voltar para o início</Link>
          </form>
        )}

        {/* ── Register ── */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="master-login-form">
            {regDone ? (
              <div className="ml-success-msg">
                ✓ Conta criada! Redirecionando para o login…
              </div>
            ) : (
              <>
                <input
                  type="text"
                  className="master-input"
                  placeholder="Seu nome"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  autoFocus
                  autoComplete="name"
                />
                <input
                  type="email"
                  className="master-input"
                  placeholder="E-mail"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <input
                  type="password"
                  className="master-input"
                  placeholder="Senha (mínimo 8 caracteres)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  className="master-input"
                  placeholder="Confirmar senha"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {regError && <p className="master-error">{regError}</p>}
                <button type="submit" className="master-btn-primary" disabled={regLoading}>
                  {regLoading ? "Criando conta..." : "Criar conta grátis"}
                </button>
                <p style={{ fontSize: "0.72rem", color: "var(--master-text-muted, #888)", textAlign: "center", lineHeight: 1.5 }}>
                  Plano gratuito inclui até 5 lojas.
                </p>
                <Link href="/master-home" className="ml-back-link">← Voltar para o início</Link>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
