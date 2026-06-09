"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.015a2.993 2.993 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
      </svg>
    ),
    title: "Arquitetura Multi-Tenant Dinâmica",
    desc: "Sirva centenas de lojistas com uma única instalação Next.js. O sistema detecta o subdomínio ou domínio customizado e renderiza o catálogo isoladamente.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Checkout PIX Rápido Integrado",
    desc: "Apresente QR Code e chave copia e cola em tempo real. Integração simplificada com Paradise Pags, OramaPay, Asaas, Skale Pay e HubPague.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v-3.75m3 4.5v-6.75m3 9v-9m3 11.25v-12.75M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: "Métricas Avançadas com UTMify",
    desc: "Não perca nenhuma venda ou clique de campanha. Rastreamento nativo de parâmetros UTM de ponta a ponta na vitrine e checkout.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.3 16.242L19.5 12m0 0l-4.2-4.243M19.5 12H9m1.5 9h-4.5a2.25 2.25 0 01-2.25-2.25v-13.5A2.25 2.25 0 016 3h4.5" />
      </svg>
    ),
    title: "Multi-Pixels de Conversão",
    desc: "Seus lojistas podem cadastrar múltiplos pixels do Meta (Facebook) e TikTok por loja, com disparos de PageView, AddToCart e Purchase via Server-Side API.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    title: "Order Bump & Upsell Nativo",
    desc: "Aumente o faturamento oferecendo produtos adicionais e complementares com um único clique diretamente na página de pagamento.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Infraestrutura Segura no PostgreSQL",
    desc: "Banco de dados otimizado usando Prisma ORM com rodagem automática de migrações no deploy e disparo de emails via SMTP Hostinger.",
  },
];

const FAQS = [
  {
    q: "Como funciona a arquitetura multi-tenant da plataforma?",
    a: "Uma única aplicação Next.js gerencia todas as requisições. O middleware ou proxy analisa o domínio (Host) da requisição (ex: loja.com ou subdominio.seusite.com), consulta o banco de dados via Prisma e carrega os produtos e configurações personalizadas daquela loja de forma transparente.",
  },
  {
    q: "Quais são as taxas cobradas pelo EcomFreedom?",
    a: "No plano Bronze (gratuito para começar) você pode hospedar até 5 lojas com uma taxa de comissão de 2.0% sobre as vendas. Nos planos Prata e Ouro, as taxas reduzem para 0.5% e 0% respectivamente, otimizando os seus lucros conforme seu negócio cresce.",
  },
  {
    q: "Como funciona o checkout PIX integrado?",
    a: "O checkout rápido gera a cobrança PIX via API de forma dinâmica e monitora o pagamento em tempo real. Assim que o pagamento é identificado pelo gateway de PIX parceiro, o status da compra é atualizado para Aprovado no banco de dados e notificado ao lojista.",
  },
  {
    q: "Eu preciso configurar servidores separados para cada lojista?",
    a: "Não! Todo o processo é unificado. Os lojistas apontam o DNS (CNAME ou registro A) para o seu servidor principal e o roteador de tráfego do Next.js se encarrega de associar o domínio correto à conta do lojista no banco de dados automaticamente.",
  },
  {
    q: "A recuperação de senha utiliza e-mail próprio?",
    a: "Sim. A plataforma vem totalmente integrada com suporte a e-mail SMTP seguro (ex: Hostinger). O sistema gera tokens temporários e seguros para redefinição de senhas, enviando links diretos aos lojistas cadastrados.",
  },
];

export default function MasterHomePage() {
  const [activeTab, setActiveTab] = useState<"tenant" | "checkout" | "pixels">("tenant");
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── Simulador de Lucros / ROI State ──
  const [storesCount, setStoresCount] = useState(10);
  const [avgSales, setAvgSales] = useState(12000);
  const [commRate, setCommRate] = useState(1.5);

  const totalGmv = storesCount * avgSales;
  const grossCommRevenue = totalGmv * (commRate / 100);

  let recommendedPlan = "Bronze";
  let planCost = 0;
  if (storesCount > 15) {
    recommendedPlan = "Ouro";
    planCost = isAnnual ? 157 : 197;
  } else if (storesCount > 5) {
    recommendedPlan = "Prata";
    planCost = isAnnual ? 77 : 97;
  } else {
    recommendedPlan = "Bronze";
    planCost = 0;
  }

  const netMonthlyProfit = grossCommRevenue - planCost;

  // ── Tab Multi-Tenant Simulado State ──
  const [vpsDomain, setVpsDomain] = useState("");
  const [vpsLogs, setVpsLogs] = useState<string[]>([]);
  const [vpsProgress, setVpsProgress] = useState(0);
  const [vpsStep, setVpsStep] = useState<"idle" | "running" | "success">("idle");
  const [activeDemoStores, setActiveDemoStores] = useState([
    { domain: "boutique-estilo.com.br", status: "online", sales: 14 },
    { domain: "techhouse.com", status: "online", sales: 8 },
  ]);

  const startVpsProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vpsDomain) return;
    const clean = vpsDomain.toLowerCase().replace(/https?:\/\//, "").trim();

    setVpsStep("running");
    setVpsProgress(0);
    setVpsLogs([]);

    const steps = [
      { progress: 20, text: `🌐 Resolvendo DNS CNAME para "${clean}"...` },
      { progress: 45, text: `🐳 Criando namespace e configurando variáveis de ambiente...` },
      { progress: 70, text: `🔒 Solicitando certificado SSL gratuito via Let's Encrypt...` },
      { progress: 90, text: `⚙️ Executando migrations do Prisma PostgreSQL para a nova loja...` },
      { progress: 100, text: `🚀 Pronto! A loja "${clean}" está ativa e pronta para vendas!` }
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setVpsProgress(s.progress);
        setVpsLogs((prev) => [...prev, s.text]);
        if (idx === steps.length - 1) {
          setVpsStep("success");
          setActiveDemoStores((prev) => [{ domain: clean, status: "online", sales: 0 }, ...prev]);
        }
      }, (idx + 1) * 750);
    });
  };

  const resetVpsDemo = () => {
    setVpsStep("idle");
    setVpsProgress(0);
    setVpsLogs([]);
    setVpsDomain("");
  };

  // ── Tab Checkout PIX Simulado State ──
  const [chName, setChName] = useState("");
  const [chEmail, setChEmail] = useState("");
  const [chCpf, setChCpf] = useState("");
  const [chPhone, setChPhone] = useState("");
  const [chErrors, setChErrors] = useState<Record<string, string>>({});
  const [chStatus, setChStatus] = useState<"form" | "generating" | "pending" | "approved">("form");
  const [pixCountdown, setPixCountdown] = useState(30);

  const handleChSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!chName.trim()) errors.name = "Preencha seu nome completo";
    if (!chEmail.includes("@")) errors.email = "Insira um e-mail válido";
    if (chCpf.replace(/\D/g, "").length < 11) errors.cpf = "CPF deve conter 11 dígitos";
    if (chPhone.replace(/\D/g, "").length < 10) errors.phone = "Telefone inválido";

    if (Object.keys(errors).length > 0) {
      setChErrors(errors);
      return;
    }

    setChErrors({});
    setChStatus("generating");

    setTimeout(() => {
      setChStatus("pending");
      setPixCountdown(30);
    }, 1200);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let autoApprove: NodeJS.Timeout;

    if (chStatus === "pending") {
      interval = setInterval(() => {
        setPixCountdown((c) => (c <= 1 ? 0 : c - 1));
      }, 1000);

      // Simular confirmação automática por webhook em 5 segundos
      autoApprove = setTimeout(() => {
        setChStatus("approved");
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(autoApprove);
    };
  }, [chStatus]);

  const resetCheckoutDemo = () => {
    setChStatus("form");
    setChName("");
    setChEmail("");
    setChCpf("");
    setChPhone("");
    setChErrors({});
  };

  // ── Tab Pixels Simulado State ──
  const [pixelTelemetry, setPixelTelemetry] = useState<string[]>([
    "[Sistema]: Console de Telemetria pronto. Interaja acima para monitorar disparos."
  ]);

  const fireMockPixel = (event: string, payload: any) => {
    const time = new Date().toLocaleTimeString("pt-BR");
    const jsonStr = JSON.stringify(payload, null, 2);
    const newLog = `[${time}] Evento "${event}" disparado com sucesso!\n-> Meta Pixel (API de Conversão): Evento transmitido.\n-> TikTok Events API: Rastreamento sincronizado.\nDados payload:\n${jsonStr}`;
    setPixelTelemetry((prev) => [newLog, ...prev.slice(0, 5)]);
  };

  return (
    <div className="lp-container">
      {/* Luzes de Fundo (Backdrop Blobs) */}
      <div className="lp-blur-blob blob-purple" />
      <div className="lp-blur-blob blob-pink" />
      <div className="lp-blur-blob blob-cyan" />

      {/* Header/Nav */}
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-logo">
            <span className="lp-logo-glow">⚡</span>
            <span className="lp-logo-text">EcomFreedom</span>
          </div>
          <nav className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Recursos</a>
            <a href="#calculator" className="lp-nav-link">Calculadora de Lucros</a>
            <a href="#demo" className="lp-nav-link">Demonstração</a>
            <a href="#pricing" className="lp-nav-link">Preços</a>
            <a href="#faq" className="lp-nav-link">FAQ</a>
          </nav>
          <div className="lp-header-actions">
            <Link href="/master-admin" className="lp-btn lp-btn-nav">
              Login / Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">
            <span className="lp-badge-dot" />
            <span>Infraestrutura SaaS de E-commerce Unificado</span>
          </div>
          <h1 className="lp-hero-title">
            Crie, Configure e Escale <br />
            Sua Própria <span className="lp-gradient-text">Rede Multi-Tenant</span>
          </h1>
          <p className="lp-hero-desc">
            Hospede centenas de lojas com domínios isolados a partir de um único painel. Checkout PIX nativo, UTMify integrado, disparo ilimitado de pixels e estatísticas em tempo real em um banco de dados unificado com Prisma.
          </p>
          <div className="lp-hero-actions">
            <Link href="/master-admin" className="lp-btn lp-btn-primary">
              Começar Agora Grátis
            </Link>
            <a href="#demo" className="lp-btn lp-btn-secondary">
              Ver Demo Interativa
            </a>
          </div>
        </div>
      </section>

      {/* Estatísticas Mockup do Dashboard */}
      <section className="lp-dashboard-preview">
        <div className="lp-window-mockup">
          <div className="lp-window-header">
            <div className="lp-window-buttons">
              <span className="lp-btn-dot red" />
              <span className="lp-btn-dot yellow" />
              <span className="lp-btn-dot green" />
            </div>
            <div className="lp-window-address">ecomfreedom.com/master-admin/dashboard</div>
          </div>
          <div className="lp-window-body">
            <div className="lp-mock-sidebar">
              <div className="lp-mock-side-item active">🏪 Lojas Hospedadas</div>
              <div className="lp-mock-side-item">👥 Usuários Owners</div>
              <div className="lp-mock-side-item">💳 Faturamento Total</div>
              <div className="lp-mock-side-item">⚙️ Configurações VPS</div>
            </div>
            <div className="lp-mock-content">
              <div className="lp-mock-grid">
                <div className="lp-mock-card">
                  <div className="lp-card-label">Total de Lojas</div>
                  <div className="lp-card-val">342</div>
                  <span className="lp-card-trend">+18 esta semana</span>
                </div>
                <div className="lp-mock-card">
                  <div className="lp-card-label">Vendas Totais Geradas</div>
                  <div className="lp-card-val text-violet">R$ 289.430,90</div>
                  <span className="lp-card-trend green">↑ 24% vs mês anterior</span>
                </div>
                <div className="lp-mock-card">
                  <div className="lp-card-label">Visitantes Online Agora</div>
                  <div className="lp-card-val text-green">
                    <span className="pulse-green-dot" /> 148
                  </div>
                  <span className="lp-card-trend">Nas últimas 4 páginas</span>
                </div>
              </div>
              <div className="lp-mock-chart">
                <div className="lp-chart-top">
                  <span>Atividade Recente das Lojas</span>
                  <span className="lp-chart-live-badge">Real-Time</span>
                </div>
                <div className="lp-chart-bars">
                  <div className="lp-chart-bar" style={{ height: "40%" }}><span className="bar-t">Loja A</span></div>
                  <div className="lp-chart-bar" style={{ height: "70%" }}><span className="bar-t">Loja B</span></div>
                  <div className="lp-chart-bar" style={{ height: "95%" }}><span className="bar-t">Loja C</span></div>
                  <div className="lp-chart-bar" style={{ height: "60%" }}><span className="bar-t">Loja D</span></div>
                  <div className="lp-chart-bar" style={{ height: "85%" }}><span className="bar-t">Loja E</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos / Features Grid */}
      <section className="lp-features-section" id="features">
        <div className="lp-section-header">
          <h2 className="lp-section-title">Infraestrutura Desenvolvida Para Alta Conversão</h2>
          <p className="lp-section-desc">
            Cada recurso foi projetado nos mínimos detalhes para garantir estabilidade, carregamento instantâneo e recuperação passiva.
          </p>
        </div>
        <div className="lp-features-grid">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="lp-feat-card">
              <div className="lp-feat-icon">{feat.icon}</div>
              <h3 className="lp-feat-title">{feat.title}</h3>
              <p className="lp-feat-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculadora de ROI Interativa */}
      <section className="lp-calculator-section" id="calculator">
        <div className="lp-section-header">
          <span className="lp-badge-mini">Simulador de Negócios</span>
          <h2 className="lp-section-title">Estime seus Lucros como Dono da Plataforma</h2>
          <p className="lp-section-desc">
            Ajuste os controles abaixo para calcular o retorno gerado pelas taxas de transação das lojas ativas na sua infraestrutura.
          </p>
        </div>

        <div className="lp-calc-container">
          <div className="lp-calc-sliders">
            {/* Slider 1 */}
            <div className="lp-slider-group">
              <div className="lp-slider-header">
                <span className="lp-slider-label">Quantidade de Lojas Ativas</span>
                <span className="lp-slider-value">{storesCount} lojas</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={storesCount}
                onChange={(e) => setStoresCount(Number(e.target.value))}
                className="lp-slider-input"
              />
              <div className="lp-slider-minmax"><span>1</span><span>100</span></div>
            </div>

            {/* Slider 2 */}
            <div className="lp-slider-group">
              <div className="lp-slider-header">
                <span className="lp-slider-label">Faturamento Médio Mensal (por loja)</span>
                <span className="lp-slider-value">R$ {avgSales.toLocaleString("pt-BR")}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={avgSales}
                onChange={(e) => setAvgSales(Number(e.target.value))}
                className="lp-slider-input"
              />
              <div className="lp-slider-minmax"><span>R$ 1.000</span><span>R$ 100.000</span></div>
            </div>

            {/* Slider 3 */}
            <div className="lp-slider-group">
              <div className="lp-slider-header">
                <span className="lp-slider-label">Sua Comissão Cobrada sobre Vendas</span>
                <span className="lp-slider-value">{commRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={commRate}
                onChange={(e) => setCommRate(Number(e.target.value))}
                className="lp-slider-input"
              />
              <div className="lp-slider-minmax"><span>0.5%</span><span>5.0%</span></div>
            </div>
          </div>

          <div className="lp-calc-results">
            <h4 className="lp-results-title">Resumo do seu Faturamento</h4>
            
            <div className="lp-results-item">
              <span className="lp-res-label">Volume Total Processado (GMV)</span>
              <span className="lp-res-val">R$ {totalGmv.toLocaleString("pt-BR")}</span>
            </div>

            <div className="lp-results-item">
              <span className="lp-res-label">Seu Ganho Bruto Mensal</span>
              <span className="lp-res-val text-violet">R$ {grossCommRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="lp-results-item">
              <span className="lp-res-label">Plano Recomendado EcomFreedom</span>
              <span className="lp-res-badge">{recommendedPlan} ({storesCount} lojas)</span>
            </div>

            <div className="lp-results-item border-highlight">
              <span className="lp-res-label">Custo da Plataforma</span>
              <span className="lp-res-val text-red">R$ {planCost}/mês</span>
            </div>

            <div className="lp-results-total">
              <span className="lp-total-label">Lucro Líquido Estimado</span>
              <div className="lp-total-val-box">
                <span className="lp-total-val">R$ {netMonthlyProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="lp-total-period">/ mês</span>
              </div>
            </div>

            <a href="#pricing" className="lp-btn lp-btn-primary lp-btn-calc-cta">
              Assinar Plano Recomendado
            </a>
          </div>
        </div>
      </section>

      {/* Demonstração Interativa */}
      <section className="lp-demo-section" id="demo">
        <div className="lp-section-header">
          <span className="lp-badge-mini">Mão na Massa</span>
          <h2 className="lp-section-title">Experimente Nossas Funcionalidades Core</h2>
          <p className="lp-section-desc">
            Explore as simulações interativas abaixo para ver a facilidade de criar lojas, gerar PIX e capturar dados.
          </p>
        </div>

        <div className="lp-demo-container">
          {/* Seletor de Abas */}
          <div className="lp-demo-tabs">
            <button
              className={`lp-demo-tab-btn ${activeTab === "tenant" ? "active" : ""}`}
              onClick={() => setActiveTab("tenant")}
            >
              🏪 Multi-Tenant & Domínios
            </button>
            <button
              className={`lp-demo-tab-btn ${activeTab === "checkout" ? "active" : ""}`}
              onClick={() => setActiveTab("checkout")}
            >
              ⚡ Checkout PIX com Confirmação
            </button>
            <button
              className={`lp-demo-tab-btn ${activeTab === "pixels" ? "active" : ""}`}
              onClick={() => setActiveTab("pixels")}
            >
              🎯 Telemetria de Pixels
            </button>
          </div>

          {/* Cartão de Exibição da Demo */}
          <div className="lp-demo-display">
            {/* ABA 1: MULTI-TENANT */}
            {activeTab === "tenant" && (
              <div className="lp-tab-tenant">
                <div className="lp-demo-desc-box">
                  <h4>Simulador de Roteamento de VPS</h4>
                  <p>Adicione um domínio customizado abaixo para simular o processo de provisionamento na hospedagem Docker integrada.</p>
                </div>

                {vpsStep === "idle" && (
                  <form onSubmit={startVpsProvision} className="lp-tenant-form">
                    <input
                      type="text"
                      className="lp-demo-input"
                      placeholder="ex: minhaloja.com.br"
                      value={vpsDomain}
                      onChange={(e) => setVpsDomain(e.target.value)}
                      required
                    />
                    <button type="submit" className="lp-btn lp-btn-primary">Hospedar Loja</button>
                  </form>
                )}

                {vpsStep === "running" && (
                  <div className="lp-tenant-running">
                    <div className="lp-progress-bar-container">
                      <div className="lp-progress-bar-fill" style={{ width: `${vpsProgress}%` }} />
                    </div>
                    <div className="lp-progress-pct">{vpsProgress}%</div>
                    <div className="lp-console-window">
                      {vpsLogs.map((log, i) => (
                        <div key={i} className="lp-console-line">{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {vpsStep === "success" && (
                  <div className="lp-tenant-success">
                    <div className="lp-success-badge">✓ Provisionamento Concluído</div>
                    <p>O domínio foi configurado no servidor Next.js e o certificado SSL Let's Encrypt está ativo.</p>
                    <button onClick={resetVpsDemo} className="lp-btn lp-btn-secondary">
                      Criar Outro Domínio
                    </button>
                  </div>
                )}

                <div className="lp-demo-stores-table">
                  <h5>Lojas no Servidor Virtual (Simuladas)</h5>
                  <div className="lp-table-wrapper">
                    <table className="lp-table">
                      <thead>
                        <tr>
                          <th>Domínio</th>
                          <th>Status</th>
                          <th>Conexão SSL</th>
                          <th>Vendas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeDemoStores.map((store, i) => (
                          <tr key={i}>
                            <td><code>{store.domain}</code></td>
                            <td>
                              <span className="lp-badge-status green">Ativo</span>
                            </td>
                            <td>
                              <span className="lp-badge-ssl">🔒 Segura</span>
                            </td>
                            <td>{store.sales} vendas</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: CHECKOUT PIX */}
            {activeTab === "checkout" && (
              <div className="lp-tab-checkout">
                <div className="lp-demo-desc-box">
                  <h4>Checkout Inteligente PIX</h4>
                  <p>Preencha os dados abaixo. Se algum dado estiver incorreto, os erros serão exibidos instantaneamente. Ao submeter, simularemos a notificação de confirmação via webhook em tempo real.</p>
                </div>

                <div className="lp-checkout-layout">
                  {/* Phone Mockup Frame */}
                  <div className="lp-phone-frame">
                    <div className="lp-phone-screen">
                      <div className="lp-phone-header">
                        <span className="lp-phone-title">Pagar com PIX</span>
                      </div>
                      
                      {chStatus === "form" && (
                        <form onSubmit={handleChSubmit} className="lp-phone-checkout-form">
                          <div className="lp-checkout-field">
                            <label>Nome Completo</label>
                            <input
                              type="text"
                              value={chName}
                              onChange={(e) => setChName(e.target.value)}
                              placeholder="ex: João Silva"
                              className={chErrors.name ? "error" : ""}
                            />
                            {chErrors.name && <span className="lp-field-err">{chErrors.name}</span>}
                          </div>

                          <div className="lp-checkout-field">
                            <label>E-mail</label>
                            <input
                              type="email"
                              value={chEmail}
                              onChange={(e) => setChEmail(e.target.value)}
                              placeholder="ex: joao@gmail.com"
                              className={chErrors.email ? "error" : ""}
                            />
                            {chErrors.email && <span className="lp-field-err">{chErrors.email}</span>}
                          </div>

                          <div className="lp-checkout-field">
                            <label>CPF</label>
                            <input
                              type="text"
                              value={chCpf}
                              onChange={(e) => setChCpf(e.target.value)}
                              placeholder="000.000.000-00"
                              className={chErrors.cpf ? "error" : ""}
                            />
                            {chErrors.cpf && <span className="lp-field-err">{chErrors.cpf}</span>}
                          </div>

                          <div className="lp-checkout-field">
                            <label>Telefone</label>
                            <input
                              type="text"
                              value={chPhone}
                              onChange={(e) => setChPhone(e.target.value)}
                              placeholder="(11) 99999-9999"
                              className={chErrors.phone ? "error" : ""}
                            />
                            {chErrors.phone && <span className="lp-field-err">{chErrors.phone}</span>}
                          </div>

                          <button type="submit" className="lp-btn lp-btn-primary w-full">
                            Gerar PIX
                          </button>
                        </form>
                      )}

                      {chStatus === "generating" && (
                        <div className="lp-phone-generating">
                          <div className="lp-spinner" />
                          <p>Gerando QR Code PIX com o gateway de pagamento...</p>
                        </div>
                      )}

                      {chStatus === "pending" && (
                        <div className="lp-phone-pending">
                          <div className="lp-pending-alert">
                            <span className="pulse-yellow-dot" /> Aguardando pagamento...
                          </div>
                          
                          <div className="lp-mock-qr-code">
                            {/* Visual QR code structure */}
                            <div className="lp-qr-inner">
                              <div className="lp-qr-corner top-left" />
                              <div className="lp-qr-corner top-right" />
                              <div className="lp-qr-corner bottom-left" />
                              <div className="lp-qr-block" />
                            </div>
                          </div>

                          <p className="lp-pix-instructions">Escaneie o QR Code ou copie o código abaixo para finalizar o PIX.</p>
                          
                          <div className="lp-pix-key-box">
                            <code>00020101021226870014br.gov.bcb.pix2565...</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("00020101021226870014br.gov.bcb.pix2565");
                                alert("Código PIX copiado com sucesso!");
                              }}
                              className="lp-pix-copy-btn"
                            >
                              Copiar
                            </button>
                          </div>

                          <span className="lp-pix-timer">Expira em: {pixCountdown}s</span>
                        </div>
                      )}

                      {chStatus === "approved" && (
                        <div className="lp-phone-approved">
                          <div className="lp-success-circle">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <h5>Pagamento Aprovado!</h5>
                          <p>O webhook de transação disparou a notificação de confirmação em tempo real para o banco de dados.</p>
                          
                          <button onClick={resetCheckoutDemo} className="lp-btn lp-btn-secondary mt-12">
                            Refazer Teste
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: PIXELS */}
            {activeTab === "pixels" && (
              <div className="lp-tab-pixels">
                <div className="lp-demo-desc-box">
                  <h4>Telemetria Dinâmica de Pixel</h4>
                  <p>Clique nas ações abaixo para simular as atividades que um cliente realiza na loja. Veja em tempo real as chamadas de API disparadas para as redes de anúncios configuradas.</p>
                </div>

                <div className="lp-pixels-dashboard">
                  <div className="lp-pixel-triggers">
                    <button
                      onClick={() => fireMockPixel("PageView", { url: "/checkout", title: "Checkout Rápido" })}
                      className="lp-pixel-btn"
                    >
                      👁️ Visualizar Checkout (PageView)
                    </button>
                    <button
                      onClick={() => fireMockPixel("AddToCart", { item_id: "prod-83", name: "Fone Bluetooth", value: 189.90, currency: "BRL" })}
                      className="lp-pixel-btn"
                    >
                      🛒 Adicionar ao Carrinho (AddToCart)
                    </button>
                    <button
                      onClick={() => fireMockPixel("Purchase", { transaction_id: "TX-92837", value: 189.90, currency: "BRL", payment_method: "PIX" })}
                      className="lp-pixel-btn purchase"
                    >
                      💰 Confirmar Compra (Purchase)
                    </button>
                  </div>

                  <div className="lp-pixel-console">
                    <h5>Terminal de Rastreamento (Meta API & TikTok API)</h5>
                    <div className="lp-console-output">
                      {pixelTelemetry.map((log, i) => (
                        <pre key={i} className="lp-telemetry-block">{log}</pre>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Planos de Preços */}
      <section className="lp-pricing-section" id="pricing">
        <div className="lp-section-header">
          <span className="lp-badge-mini">Investimento</span>
          <h2 className="lp-section-title">Escolha o Plano Ideal Para o seu Negócio</h2>
          <p className="lp-section-desc">
            Sem taxas ocultas. Escolha o faturamento baseado em quantidade de lojas ou remova todas as taxas processadas.
          </p>

          <div className="lp-billing-toggle-box">
            <span className={!isAnnual ? "active-period" : ""}>Mensal</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`lp-billing-toggle-btn ${isAnnual ? "annual" : ""}`}
            >
              <span className="lp-toggle-circle" />
            </button>
            <span className={isAnnual ? "active-period" : ""}>
              Anual <span className="lp-toggle-discount">20% OFF</span>
            </span>
          </div>
        </div>

        <div className="lp-pricing-grid">
          {/* Plano Bronze */}
          <div className="lp-price-card">
            <div className="lp-price-badge">Plano Inicial</div>
            <h3 className="lp-price-title">Bronze</h3>
            <p className="lp-price-desc">Comece sem custos fixos e hospede suas primeiras lojas Pix rapidamente.</p>
            <div className="lp-price-amount">
              <span className="lp-currency">R$</span>
              <span className="lp-amount">0</span>
              <span className="lp-period">/mês</span>
            </div>
            <ul className="lp-price-features">
              <li>🏪 Até <strong>5 lojas</strong> ativas</li>
              <li>💸 <strong>2.0% de taxa</strong> por venda PIX</li>
              <li>🎯 Pixels Meta/TikTok ilimitados</li>
              <li>📊 UTMify tracking unificado</li>
              <li>✓ Certificados SSL automáticos</li>
            </ul>
            <Link href="/master-admin" className="lp-btn lp-btn-pricing-cta">
              Começar Grátis
            </Link>
          </div>

          {/* Plano Prata (Popular) */}
          <div className="lp-price-card popular">
            <div className="lp-popular-ribbon">MAIS ASSINADO</div>
            <div className="lp-price-badge text-violet">Profissional</div>
            <h3 className="lp-price-title">Prata</h3>
            <p className="lp-price-desc">A melhor relação custo-benefício para redes de e-commerce e afiliados profissionais.</p>
            <div className="lp-price-amount">
              <span className="lp-currency">R$</span>
              <span className="lp-amount">{isAnnual ? "77" : "97"}</span>
              <span className="lp-period">/mês</span>
            </div>
            {isAnnual && <span className="lp-save-hint">Faturado R$ 924 anualmente</span>}
            <ul className="lp-price-features">
              <li>🏪 Até <strong>15 lojas</strong> ativas</li>
              <li>💸 <strong>Apenas 0.5%</strong> de taxa por venda</li>
              <li>⚡ Checkout PIX de carregamento ultra-rápido</li>
              <li>📞 Suporte prioritário via WhatsApp</li>
              <li>✓ Integração com domínios .com.br</li>
            </ul>
            <Link href="/master-admin" className="lp-btn lp-btn-primary lp-btn-pricing-cta">
              Assinar Plano Prata
            </Link>
          </div>

          {/* Plano Ouro */}
          <div className="lp-price-card">
            <div className="lp-price-badge text-cyan">Ilimitado</div>
            <h3 className="lp-price-title">Ouro</h3>
            <p className="lp-price-desc">Infraestrutura massiva e livre de comissões para grandes operações.</p>
            <div className="lp-price-amount">
              <span className="lp-currency">R$</span>
              <span className="lp-amount">{isAnnual ? "157" : "197"}</span>
              <span className="lp-period">/mês</span>
            </div>
            {isAnnual && <span className="lp-save-hint">Faturado R$ 1.884 anualmente</span>}
            <ul className="lp-price-features">
              <li>🏪 Lojas **Ilimitadas**</li>
              <li>💸 <strong>0% de taxa</strong> nas vendas</li>
              <li>👑 Suporte VIP exclusivo 24/7</li>
              <li>🛡️ Backup de banco de dados prioritário</li>
              <li>🚀 Acesso antecipado a atualizações</li>
            </ul>
            <Link href="/master-admin" className="lp-btn lp-btn-pricing-cta">
              Quero o Plano Ouro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="lp-faq-section" id="faq">
        <div className="lp-section-header">
          <span className="lp-badge-mini">FAQ</span>
          <h2 className="lp-section-title">Perguntas Frequentes</h2>
          <p className="lp-section-desc">Tire suas principais dúvidas sobre o funcionamento do multi-tenant e checkout.</p>
        </div>

        <div className="lp-faq-list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`lp-faq-item ${openFaq === i ? "active" : ""}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="lp-faq-question">
                <span>{faq.q}</span>
                <span className="lp-faq-arrow">▼</span>
              </div>
              <div className="lp-faq-answer">
                <div className="lp-faq-answer-inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span>⚡</span> EcomFreedom
          </div>
          <p className="lp-footer-desc">
            A infraestrutura multi-tenant definitiva para hospedar e escalar seu ecossistema de checkout rápido em PIX.
          </p>
          <div className="lp-footer-divider" />
          <div className="lp-footer-copy">
            © {new Date().getFullYear()} EcomFreedom. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* CSS Vanilla Embutido para Customização Total e Performance */}
      <style>{`
        /* ── Reset Local ── */
        .lp-container {
          min-height: 100vh;
          background: #09090c;
          color: #f4f4f5;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        /* ── Blurs e Neons de Fundo ── */
        .lp-blur-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 10s ease-in-out infinite alternate;
        }
        .blob-purple {
          width: 500px;
          height: 500px;
          background: #7c3aed;
          top: -150px;
          right: -100px;
        }
        .blob-pink {
          width: 600px;
          height: 600px;
          background: #db2777;
          bottom: 25%;
          left: -200px;
          animation-delay: 2s;
        }
        .blob-cyan {
          width: 450px;
          height: 450px;
          background: #0891b2;
          bottom: -50px;
          right: 5%;
          animation-delay: 4s;
        }
        @keyframes pulseGlow {
          0% { transform: scale(1) translate(0, 0); opacity: 0.12; }
          100% { transform: scale(1.15) translate(20px, 30px); opacity: 0.18; }
        }

        /* ── Header ── */
        .lp-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(9, 9, 12, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .lp-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 1.4rem;
          color: #ffffff;
        }
        .lp-logo-glow {
          color: #a78bfa;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.75));
        }
        .lp-nav-links {
          display: flex;
          gap: 32px;
        }
        .lp-nav-link {
          color: #a1a1aa;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.25s;
          text-decoration: none;
        }
        .lp-nav-link:hover {
          color: #ffffff;
        }

        /* ── Botões ── */
        .lp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
        }
        .lp-btn-nav {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .lp-btn-nav:hover {
          background: #ffffff;
          color: #09090c;
        }
        .lp-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #db2777);
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.35);
        }
        .lp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.55);
        }
        .lp-btn-secondary {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fafafa;
        }
        .lp-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.18);
        }

        /* ── Hero ── */
        .lp-hero {
          position: relative;
          z-index: 1;
          padding: 120px 24px 80px;
          text-align: center;
        }
        .lp-hero-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.25);
          color: #c084fc;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 6px 16px;
          border-radius: 99px;
          margin-bottom: 32px;
        }
        .lp-badge-dot {
          width: 8px;
          height: 8px;
          background: #a78bfa;
          border-radius: 50%;
          animation: pulseDot 2s infinite;
        }
        @keyframes pulseDot {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 10px #a78bfa; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .lp-hero-title {
          font-size: clamp(2.5rem, 6.5vw, 4.4rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1.8px;
          margin-bottom: 24px;
        }
        .lp-gradient-text {
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #22d3ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-hero-desc {
          font-size: 1.15rem;
          color: #a1a1aa;
          line-height: 1.6;
          max-width: 760px;
          margin: 0 auto 40px;
        }
        .lp-hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .lp-hero-actions .lp-btn {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 0.98rem;
        }

        /* ── Dashboard Preview Mockup ── */
        .lp-dashboard-preview {
          max-width: 1100px;
          margin: 0 auto 100px;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }
        .lp-window-mockup {
          background: #111115;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
        }
        .lp-window-header {
          background: #18181f;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          height: 52px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 20px;
        }
        .lp-window-buttons {
          display: flex;
          gap: 6px;
        }
        .lp-btn-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .lp-btn-dot.red { background: #ef4444; }
        .lp-btn-dot.yellow { background: #f59e0b; }
        .lp-btn-dot.green { background: #10b981; }
        .lp-window-address {
          font-size: 0.75rem;
          color: #71717a;
          font-family: monospace;
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 14px;
          border-radius: 6px;
          flex: 1;
          max-width: 420px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lp-window-body {
          display: flex;
          min-height: 380px;
        }
        .lp-mock-sidebar {
          width: 200px;
          background: #141419;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 20px 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .lp-mock-side-item {
          font-size: 0.8rem;
          color: #88889a;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
        }
        .lp-mock-side-item.active {
          background: rgba(124, 58, 237, 0.1);
          color: #c084fc;
          font-weight: 600;
        }
        .lp-mock-content {
          flex: 1;
          padding: 24px;
          background: #09090c;
        }
        .lp-mock-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .lp-mock-card {
          background: #121216;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }
        .lp-card-label {
          font-size: 0.7rem;
          color: #71717a;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .lp-card-val {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 8px 0 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lp-card-val.text-violet { color: #c084fc; }
        .lp-card-val.text-green { color: #34d399; }
        .lp-card-trend {
          font-size: 0.72rem;
          color: #71717a;
        }
        .lp-card-trend.green { color: #10b981; }
        
        /* Ponto piscante verde */
        .pulse-green-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          animation: pulseGreen 1.5s infinite;
        }
        @keyframes pulseGreen {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 8px #10b981; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }

        .lp-mock-chart {
          background: #121216;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }
        .lp-chart-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: #a1a1aa;
          margin-bottom: 24px;
        }
        .lp-chart-live-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          font-size: 0.65rem;
          padding: 3px 10px;
          border-radius: 99px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .lp-chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 140px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0 16px;
        }
        .lp-chart-bar {
          width: 56px;
          background: linear-gradient(180deg, #7c3aed, rgba(124, 58, 237, 0.15));
          border-radius: 6px 6px 0 0;
          position: relative;
        }
        .bar-t {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.65rem;
          color: #71717a;
          white-space: nowrap;
        }

        /* ── Headers de Seções ── */
        .lp-section-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 24px;
        }
        .lp-section-title {
          font-size: clamp(1.8rem, 4.5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -1px;
          margin-top: 12px;
          margin-bottom: 16px;
          color: #ffffff;
        }
        .lp-section-desc {
          color: #a1a1aa;
          font-size: 1.05rem;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .lp-badge-mini {
          font-size: 0.72rem;
          font-weight: 700;
          color: #c084fc;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* ── Recursos / Features Grid ── */
        .lp-features-section {
          padding: 80px 24px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .lp-feat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .lp-feat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.08), transparent 60%);
          pointer-events: none;
        }
        .lp-feat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(124, 58, 237, 0.3);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .lp-feat-icon {
          width: 48px;
          height: 48px;
          background: rgba(124, 58, 237, 0.15);
          color: #c084fc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .lp-feat-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #ffffff;
        }
        .lp-feat-desc {
          font-size: 0.9rem;
          color: #a1a1aa;
          line-height: 1.6;
        }

        /* ── Calculadora de Ganhos ── */
        .lp-calculator-section {
          padding: 80px 24px;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lp-calc-container {
          background: rgba(18, 18, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
        }
        .lp-calc-sliders {
          padding: 44px;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }
        .lp-slider-group {
          display: flex;
          flex-direction: column;
        }
        .lp-slider-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 0.92rem;
          font-weight: 600;
        }
        .lp-slider-label {
          color: #a1a1aa;
        }
        .lp-slider-value {
          color: #c084fc;
          font-weight: 700;
        }
        .lp-slider-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 99px;
          background: #27272a;
          outline: none;
        }
        .lp-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #c084fc;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(192, 132, 252, 0.5);
          transition: transform 0.15s;
        }
        .lp-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .lp-slider-minmax {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #71717a;
          margin-top: 6px;
        }

        .lp-calc-results {
          background: rgba(124, 58, 237, 0.04);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding: 44px;
          display: flex;
          flex-direction: column;
        }
        .lp-results-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 12px;
        }
        .lp-results-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          color: #a1a1aa;
          margin-bottom: 18px;
        }
        .lp-results-item.border-highlight {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 18px;
          margin-bottom: 24px;
        }
        .lp-res-val {
          font-weight: 700;
          color: #ffffff;
        }
        .lp-res-val.text-violet { color: #c084fc; }
        .lp-res-val.text-red { color: #ef4444; }
        .lp-res-badge {
          background: rgba(192, 132, 252, 0.15);
          color: #c084fc;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 99px;
        }
        .lp-results-total {
          margin-bottom: 32px;
        }
        .lp-total-label {
          font-size: 0.8rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .lp-total-val-box {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          margin-top: 6px;
        }
        .lp-total-val {
          font-size: 2.2rem;
          font-weight: 900;
          color: #34d399;
          line-height: 1;
          letter-spacing: -1px;
        }
        .lp-total-period {
          font-size: 0.85rem;
          color: #71717a;
          margin-bottom: 4px;
        }
        .lp-btn-calc-cta {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-size: 0.95rem;
        }

        /* ── Demonstração Interativa ── */
        .lp-demo-section {
          padding: 80px 24px;
          max-width: 960px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lp-demo-container {
          background: rgba(18, 18, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
        }
        .lp-demo-tabs {
          display: flex;
          background: #141419;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 6px;
          gap: 4px;
        }
        .lp-demo-tab-btn {
          flex: 1;
          background: none;
          border: none;
          color: #88889a;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .lp-demo-tab-btn:hover {
          color: #ffffff;
        }
        .lp-demo-tab-btn.active {
          background: #1c1924;
          color: #c084fc;
        }
        .lp-demo-display {
          padding: 40px;
          min-height: 420px;
        }
        .lp-demo-desc-box {
          margin-bottom: 28px;
        }
        .lp-demo-desc-box h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .lp-demo-desc-box p {
          font-size: 0.9rem;
          color: #a1a1aa;
          line-height: 1.5;
        }

        /* ── Input Geral ── */
        .lp-demo-input {
          background: #141419;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #ffffff;
          padding: 12px 16px;
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .lp-demo-input:focus {
          border-color: #7c3aed;
        }

        /* ── Aba Tenant ── */
        .lp-tenant-form {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }
        .lp-tenant-form .lp-demo-input {
          flex: 1;
        }
        .lp-tenant-running {
          margin-bottom: 32px;
        }
        .lp-progress-bar-container {
          background: #27272a;
          height: 8px;
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .lp-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #db2777);
          border-radius: 99px;
          transition: width 0.3s ease;
        }
        .lp-progress-pct {
          font-size: 0.8rem;
          font-weight: 700;
          color: #c084fc;
          text-align: right;
          margin-bottom: 16px;
        }
        .lp-console-window {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 16px;
          font-family: monospace;
          font-size: 0.78rem;
          color: #34d399;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lp-console-line {
          word-break: break-all;
        }
        .lp-tenant-success {
          text-align: center;
          padding: 30px 20px;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 12px;
          margin-bottom: 32px;
          animation: fadeScale 0.35s ease;
        }
        .lp-success-badge {
          display: inline-block;
          background: #10b981;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 99px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .lp-demo-stores-table h5 {
          font-size: 0.82rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .lp-table-wrapper {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
        }
        .lp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .lp-table th {
          background: #141419;
          text-align: left;
          color: #71717a;
          padding: 12px 16px;
          font-weight: 600;
        }
        .lp-table td {
          padding: 14px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.01);
        }
        .lp-badge-status {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 99px;
        }
        .lp-badge-status.green {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }
        .lp-badge-ssl {
          font-size: 0.72rem;
          color: #34d399;
          font-weight: 600;
        }

        /* ── Aba Checkout PIX ── */
        .lp-checkout-layout {
          display: flex;
          justify-content: center;
        }
        .lp-phone-frame {
          width: 320px;
          height: 580px;
          background: #000000;
          border: 12px solid #27272a;
          border-radius: 36px;
          padding: 8px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          position: relative;
        }
        .lp-phone-screen {
          background: #0d0d10;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 18px;
        }
        .lp-phone-header {
          text-align: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .lp-phone-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
        }
        .lp-phone-checkout-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lp-checkout-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lp-checkout-field label {
          font-size: 0.75rem;
          color: #a1a1aa;
          font-weight: 600;
        }
        .lp-checkout-field input {
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #ffffff;
          padding: 10px 12px;
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .lp-checkout-field input:focus {
          border-color: #7c3aed;
        }
        .lp-checkout-field input.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.04);
        }
        .lp-field-err {
          font-size: 0.7rem;
          color: #ef4444;
          font-weight: 500;
        }
        .lp-phone-generating {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
        }
        .lp-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(124, 58, 237, 0.2);
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .lp-phone-pending {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          text-align: center;
        }
        .lp-pending-alert {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 99px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
        }
        .pulse-yellow-dot {
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulseYellow 1.5s infinite;
        }
        @keyframes pulseYellow {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .lp-mock-qr-code {
          width: 140px;
          height: 140px;
          background: #ffffff;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .lp-qr-inner {
          width: 100%;
          height: 100%;
          border: 2px solid #000000;
          position: relative;
        }
        .lp-qr-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 4px solid #000000;
        }
        .lp-qr-corner.top-left { top: 0; left: 0; }
        .lp-qr-corner.top-right { top: 0; right: 0; }
        .lp-qr-corner.bottom-left { bottom: 0; left: 0; }
        .lp-qr-block {
          position: absolute;
          top: 35px;
          left: 35px;
          width: 46px;
          height: 46px;
          background-image: repeating-linear-gradient(45deg, #000 0px, #000 6px, transparent 6px, transparent 12px);
        }
        .lp-pix-instructions {
          font-size: 0.75rem;
          color: #a1a1aa;
          margin-bottom: 12px;
        }
        .lp-pix-key-box {
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 12px;
        }
        .lp-pix-key-box code {
          font-size: 0.68rem;
          color: #a1a1aa;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }
        .lp-pix-copy-btn {
          background: #7c3aed;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }
        .lp-pix-timer {
          font-size: 0.72rem;
          color: #71717a;
        }

        .lp-phone-approved {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
          animation: fadeScale 0.35s ease;
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .lp-success-circle {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .lp-phone-approved h5 {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .lp-phone-approved p {
          font-size: 0.78rem;
          color: #a1a1aa;
          line-height: 1.5;
        }

        /* ── Aba Pixels ── */
        .lp-pixels-dashboard {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 28px;
        }
        .lp-pixel-triggers {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lp-pixel-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 14px 18px;
          border-radius: 12px;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lp-pixel-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.18);
        }
        .lp-pixel-btn.purchase {
          background: rgba(219, 39, 119, 0.1);
          border-color: rgba(219, 39, 119, 0.25);
          color: #f472b6;
        }
        .lp-pixel-btn.purchase:hover {
          background: rgba(219, 39, 119, 0.15);
          border-color: rgba(219, 39, 119, 0.45);
        }
        .lp-pixel-console h5 {
          font-size: 0.8rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .lp-console-output {
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px;
          min-height: 260px;
          max-height: 260px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lp-telemetry-block {
          font-family: monospace;
          font-size: 0.75rem;
          color: #34d399;
          white-space: pre-wrap;
          word-break: break-all;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 12px;
          margin: 0;
        }

        /* ── Seção de Preços ── */
        .lp-pricing-section {
          padding: 80px 24px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lp-billing-toggle-box {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #141419;
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #71717a;
          margin-top: 24px;
        }
        .lp-billing-toggle-box .active-period {
          color: #ffffff;
        }
        .lp-billing-toggle-btn {
          width: 44px;
          height: 24px;
          background: #27272a;
          border-radius: 99px;
          position: relative;
          cursor: pointer;
          border: none;
          transition: background 0.25s;
        }
        .lp-billing-toggle-btn.annual {
          background: #7c3aed;
        }
        .lp-toggle-circle {
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform 0.25s;
        }
        .lp-billing-toggle-btn.annual .lp-toggle-circle {
          transform: translateX(20px);
        }
        .lp-toggle-discount {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 99px;
          margin-left: 4px;
        }

        .lp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
          margin-top: 56px;
        }
        .lp-price-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s;
        }
        .lp-price-card.popular {
          background: rgba(124, 58, 237, 0.03);
          border-color: rgba(124, 58, 237, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        .lp-popular-ribbon {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #7c3aed, #db2777);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 4px 14px;
          border-radius: 99px;
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4);
        }
        .lp-price-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }
        .lp-price-badge.text-violet { color: #c084fc; }
        .lp-price-badge.text-cyan { color: #22d3ee; }
        
        .lp-price-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .lp-price-desc {
          font-size: 0.9rem;
          color: #a1a1aa;
          line-height: 1.5;
          margin-bottom: 32px;
          min-height: 54px;
        }
        .lp-price-amount {
          display: flex;
          align-items: flex-end;
          margin-bottom: 8px;
        }
        .lp-currency {
          font-size: 1.2rem;
          font-weight: 700;
          margin-right: 4px;
          margin-bottom: 6px;
        }
        .lp-amount {
          font-size: 3.2rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 0.95;
          letter-spacing: -2px;
        }
        .lp-period {
          font-size: 0.88rem;
          color: #71717a;
          margin-left: 4px;
          margin-bottom: 6px;
        }
        .lp-save-hint {
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 600;
          margin-bottom: 24px;
          margin-top: -4px;
        }
        .lp-price-features {
          list-style: none;
          padding: 24px 0 0;
          margin: 0 0 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lp-price-features li {
          font-size: 0.9rem;
          color: #d4d4d8;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-price-features li::before {
          content: "✓";
          color: #34d399;
          font-weight: 800;
        }
        .lp-btn-pricing-cta {
          margin-top: auto;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 12px;
          border-radius: 10px;
          font-weight: 700;
          text-align: center;
        }
        .lp-btn-pricing-cta:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        /* ── Seção FAQ Accordion ── */
        .lp-faq-section {
          padding: 80px 24px 120px;
          max-width: 760px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lp-faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .lp-faq-item {
          background: rgba(18, 18, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s;
        }
        .lp-faq-item:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .lp-faq-question {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
        }
        .lp-faq-arrow {
          font-size: 0.7rem;
          color: #71717a;
          transition: transform 0.25s;
        }
        .lp-faq-item.active .lp-faq-arrow {
          transform: rotate(180deg);
          color: #c084fc;
        }
        .lp-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
        }
        .lp-faq-item.active .lp-faq-answer {
          max-height: 1000px;
          transition: max-height 0.3s cubic-bezier(1, 0, 1, 0);
        }
        .lp-faq-answer-inner {
          padding: 0 24px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 14px;
        }
        .lp-faq-answer p {
          margin: 0;
          font-size: 0.9rem;
          color: #a1a1aa;
          line-height: 1.6;
        }

        /* ── Footer ── */
        .lp-footer {
          background: #060608;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 80px 24px 48px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .lp-footer-inner {
          max-width: 600px;
          margin: 0 auto;
        }
        .lp-footer-brand {
          font-size: 1.4rem;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .lp-footer-brand span {
          color: #c084fc;
        }
        .lp-footer-desc {
          font-size: 0.9rem;
          color: #71717a;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .lp-footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 32px;
        }
        .lp-footer-copy {
          font-size: 0.78rem;
          color: #52525b;
        }

        /* ── Responsividade Geral ── */
        @media (max-width: 960px) {
          .lp-header-inner { height: 72px; }
          .lp-nav-links { display: none; }
          .lp-calc-container { grid-template-columns: 1fr; }
          .lp-calc-results { border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.08); }
          .lp-window-body { flex-direction: column; }
          .lp-mock-sidebar { width: 100%; border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.06); flex-direction: row; padding: 12px; overflow-x: auto; }
          .lp-mock-side-item { white-space: nowrap; padding: 8px 12px; }
          .lp-mock-grid { grid-template-columns: 1fr; }
          .lp-pixels-dashboard { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .lp-hero { padding: 80px 20px 48px; }
          .lp-hero-actions { flex-direction: column; }
          .lp-hero-actions .lp-btn { width: 100%; }
          .lp-calc-sliders, .lp-calc-results { padding: 24px; }
          .lp-demo-display { padding: 20px; }
          .lp-tenant-form { flex-direction: column; }
          .lp-tenant-form .lp-btn { width: 100%; }
          .lp-pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
