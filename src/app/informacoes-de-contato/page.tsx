import { getTenant } from "@/lib/tenant";
import { readStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function InformacoesDeContatoPage() {
  const tenant = await getTenant();
  const store = readStoreData(tenant);

  const storeName = store.storeName;
  const email = `contato@${tenant === "localhost" ? storeName.toLowerCase().replace(/\s+/g, "") + ".com" : tenant}`;
  const siteUrl = tenant === "localhost" ? "http://localhost:3000" : `https://${tenant}`;
  const effectiveDate = store.legalEffectiveDate || "03 de maio de 2023";

  return (
    <main className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">Informações de Contato</h1>
        <p className="legal-meta">Data de Vigência: {effectiveDate}</p>
      </header>

      <div className="legal-content">
        <div className="legal-section">
          <h2>Canais de Atendimento ao Cliente (SAC)</h2>
          <p>
            Na <strong>{storeName}</strong>, priorizamos um atendimento humano, rápido e transparente. Se você tem dúvidas sobre algum produto, precisa de suporte com a entrega, rastreamento ou deseja solicitar uma troca/reembolso, utilize nossos canais oficiais de atendimento:
          </p>
        </div>

        <div className="legal-section">
          <h2>Atendimento via E-mail</h2>
          <p>
            Você pode enviar suas solicitações, dúvidas ou feedback diretamente para o nosso e-mail de suporte. Respondemos a todas as mensagens em até <strong>24 horas úteis</strong>.
          </p>
          <div style={{ marginTop: "16px" }}>
            <a href={`mailto:${email}`} className="legal-contact-item">
              📧 {email}
            </a>
          </div>
        </div>

        <div className="legal-section">
          <h2>Horários de Funcionamento</h2>
          <p>
            Nossa equipe de suporte está de prontidão nos seguintes horários:
          </p>
          <ul>
            <li><strong>Segunda a Sábado:</strong> das 07:00 às 22:00 (horário de Brasília)</li>
            <li><strong>Domingos e Feriados:</strong> atendimento sob escala (retornos pontuais)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>Segurança nas Compras</h2>
          <p>
            Lembramos que todas as transações realizadas no site da <strong>{storeName}</strong> contam com criptografia SSL avançada e gateways de pagamento homologados, garantindo total segurança para os seus dados pessoais e de pagamento.
          </p>
        </div>

        <div className="legal-contact-card">
          <h2>Visite Nosso Site</h2>
          <p>Para conferir nossas coleções, promoções e novidades, acesse:</p>
          <div className="legal-contact-info">
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="legal-contact-item">
              🌐 {siteUrl.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
