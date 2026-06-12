import { getTenant } from "@/lib/tenant";
import { readStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function PoliticasDeReembolsoPage() {
  const tenant = await getTenant();
  const store = readStoreData(tenant);

  const storeName = store.storeName;
  const email = `contato@${tenant === "localhost" ? storeName.toLowerCase().replace(/\s+/g, "") + ".com" : tenant}`;
  const effectiveDate = store.legalEffectiveDate || "03 de maio de 2023";

  return (
    <main className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">Políticas de Troca e Reembolso</h1>
        <p className="legal-meta">Data de Vigência: {effectiveDate}</p>
      </header>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Direito de Arrependimento (Desistência)</h2>
          <p>
            Em cumprimento ao artigo 49 do Código de Defesa do Consumidor (CDC), a <strong>{storeName}</strong> garante ao cliente o direito de desistir da compra por arrependimento em até <strong>7 (sete) dias corridos</strong>, contados a partir da data de recebimento do produto. O reembolso dos valores pagos será efetuado integralmente.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Condições para Aceitação da Devolução</h2>
          <p>
            Para que o processo de troca ou reembolso seja homologado, a mercadoria devolvida deve atender às seguintes condições básicas:
          </p>
          <ul>
            <li>Estar em sua embalagem original, sem danos e lacrada (se aplicável);</li>
            <li>Não conter indícios de uso, lavagem, desgaste ou manipulação inadequada;</li>
            <li>Acompanhar todos os acessórios, manuais e brindes inclusos.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Produtos com Defeito de Fabricação</h2>
          <p>
            Caso você identifique qualquer defeito ou vício de fabricação no produto adquirido, possui o prazo de até 30 (trinta) dias corridos para efetuar a comunicação e acionar a garantia legal. A <strong>{storeName}</strong> providenciará a troca ou conserto do produto, sem custos adicionais de frete para o cliente.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Procedimento de Envio (Logística Reversa)</h2>
          <p>
            Para solicitar uma troca ou devolução, entre em contato via e-mail informando o número do pedido e anexando imagens que demonstrem as condições do produto. Após validação do atendimento, forneceremos uma etiqueta de autorização de postagem reversa dos Correios. O cliente deverá postar a mercadoria em qualquer agência dos Correios, sem custos.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Prazos e Métodos de Restituição (Estorno)</h2>
          <p>
            A restituição dos valores é efetuada na mesma modalidade de pagamento utilizada na compra original:
          </p>
          <ul>
            <li><strong>Pix:</strong> O estorno será transferido de volta para a mesma conta bancária pagadora em até 5 (cinco) dias úteis após a conferência técnica da mercadoria recebida em nosso armazém;</li>
            <li><strong>Cartão de Crédito:</strong> A solicitação de estorno é repassada imediatamente à adquirente/operadora do cartão. O lançamento do crédito na fatura é de responsabilidade da operadora e pode levar de 1 a 2 faturas subsequentes.</li>
          </ul>
        </div>

        <div className="legal-contact-card">
          <h2>Como Solicitar o Reembolso?</h2>
          <p>Para dar início ao seu pedido de devolução, encaminhe um e-mail para a nossa equipe de suporte:</p>
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
