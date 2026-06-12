import { getTenant } from "@/lib/tenant";
import { readStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function PoliticaDePrivacidadePage() {
  const tenant = await getTenant();
  const store = readStoreData(tenant);

  const storeName = store.storeName;
  const email = `contato@${tenant === "localhost" ? storeName.toLowerCase().replace(/\s+/g, "") + ".com" : tenant}`;
  const effectiveDate = store.legalEffectiveDate || "03 de maio de 2023";

  return (
    <main className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">Política de Privacidade</h1>
        <p className="legal-meta">Data de Vigência: {effectiveDate}</p>
      </header>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Compromisso com a Privacidade</h2>
          <p>
            Na <strong>{storeName}</strong>, respeitamos a sua privacidade e temos o compromisso de proteger as informações pessoais que você compartilha conosco. Esta política detalha como coletamos, usamos, armazenamos e protegemos seus dados, em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Informações que Coletamos</h2>
          <p>
            Durante o processo de compra ou navegação em nosso site, podemos coletar:
          </p>
          <ul>
            <li><strong>Dados de identificação:</strong> Nome completo, CPF e data de nascimento;</li>
            <li><strong>Dados de contato:</strong> E-mail, telefone celular/WhatsApp;</li>
            <li><strong>Dados de logística:</strong> Endereço de entrega completo e endereço de cobrança;</li>
            <li><strong>Informações técnicas:</strong> Endereço IP, dados de cookies, tipo de navegador e comportamento de navegação.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Como Utilizamos Seus Dados</h2>
          <p>
            Os dados coletados são usados estritamente para finalidades legítimas, incluindo:
          </p>
          <ul>
            <li>Processar, faturar e enviar suas compras;</li>
            <li>Comunicar atualizações sobre o andamento do pedido e código de rastreamento;</li>
            <li>Oferecer suporte ao cliente (SAC) e processar devoluções ou reembolsos;</li>
            <li>Cumprir obrigações legais, fiscais ou regulatórias;</li>
            <li>Melhorar sua experiência no site e veicular publicidade segmentada relevante (ex: Facebook Pixel e TikTok Pixel).</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Cookies e Tecnologias de Rastreamento</h2>
          <p>
            Utilizamos cookies para personalizar o conteúdo do site, analisar o tráfego e lembrar itens no seu carrinho de compras. Você pode gerenciar as preferências de cookies diretamente no seu navegador, contudo, a desativação de cookies essenciais pode limitar algumas funcionalidades da nossa loja online.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Compartilhamento de Dados com Terceiros</h2>
          <p>
            A <strong>{storeName}</strong> não vende ou aluga seus dados a terceiros. Para viabilizar suas compras, compartilhamos informações com parceiros estritamente necessários:
          </p>
          <ul>
            <li>Intermediadores de pagamento homologados no checkout;</li>
            <li>Empresas logísticas e Correios responsáveis pela entrega física;</li>
            <li>Plataformas de análise de tráfego e publicidade (Meta, TikTok, Google).</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>6. Segurança e Retenção</h2>
          <p>
            Adotamos medidas técnicas e administrativas robustas para blindar seus dados pessoais contra acessos não autorizados, vazamentos ou perdas. Mantemos seus dados apenas pelo período necessário para cumprir as finalidades desta política ou para cumprimento de prazos de guarda previstos em lei.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Seus Direitos Legais</h2>
          <p>
            Como titular dos dados de acordo com a LGPD, você possui o direito de confirmar a existência do tratamento de seus dados, solicitar correção de dados incompletos/inexatos, requerer a exclusão de dados desnecessários ou revogar o consentimento previamente fornecido.
          </p>
        </div>

        <div className="legal-contact-card">
          <h2>Fale Conosco sobre Privacidade</h2>
          <p>Se você deseja exercer qualquer um de seus direitos ou possui dúvidas específicas sobre a proteção de dados pessoais em nosso site, fale com o nosso encarregado:</p>
          <div className="legal-contact-info">
            <a href={`mailto:${email}`} className="legal-contact-item">
              📧 {email}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
