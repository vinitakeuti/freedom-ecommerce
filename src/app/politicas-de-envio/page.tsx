import { getTenant } from "@/lib/tenant";
import { readStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function PoliticasDeEnvioPage() {
  const tenant = await getTenant();
  const store = readStoreData(tenant);

  const storeName = store.storeName;
  const email = `contato@${tenant === "localhost" ? storeName.toLowerCase().replace(/\s+/g, "") + ".com" : tenant}`;
  const effectiveDate = store.legalEffectiveDate || "03 de maio de 2023";
  const freeShippingMin = store.freeShippingMin ?? 199;

  return (
    <main className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">Políticas de Envio e Entrega</h1>
        <p className="legal-meta">Data de Vigência: {effectiveDate}</p>
      </header>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Processamento e Postagem</h2>
          <p>
            Após a confirmação do pagamento, todos os pedidos passam por uma fase de processamento, separação técnica de estoque e embalagem. A postagem do produto junto à transportadora ou Correios ocorre em até <strong>3 (três) dias úteis</strong>. O prazo total de recebimento informado no checkout já inclui este período de preparação.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Métodos e Prazos de Entrega</h2>
          <p>
            Trabalhamos com Correios (Sedex e PAC) e transportadoras privadas de alta confiança para realizar as entregas. Os prazos estimados de trânsito variam conforme a região do país e a modalidade de envio selecionada durante a finalização do seu pedido.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Código de Rastreamento</h2>
          <p>
            Assim que a postagem for concluída, você receberá automaticamente um e-mail de notificação com o seu código de rastreamento exclusivo e o link para monitoramento. As atualizações no sistema das transportadoras podem levar de 24 a 48 horas úteis para começarem a constar.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Endereço de Entrega Incorreto ou Incompleto</h2>
          <p>
            O preenchimento completo e correto do endereço de entrega é de inteira responsabilidade do cliente no momento da compra. Caso o produto seja devolvido ao nosso centro de distribuição por motivo de endereço incorreto, numeração inexistente ou dados incompletos, caberá ao cliente arcar com os custos de reenvio da mercadoria.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Destinatário Ausente e Tentativas de Entrega</h2>
          <p>
            As transportadoras costumam realizar até 3 (três) tentativas de entrega em dias alternados. Se nenhuma tentativa obtiver êxito, o pacote poderá ser direcionado para uma agência de retirada local ou retornar ao nosso centro de distribuição. Certifique-se de monitorar o rastreamento para evitar a devolução automática.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Frete Grátis</h2>
          <p>
            A <strong>{storeName}</strong> oferece frete grátis para compras que atinjam o valor mínimo estabelecido. Atualmente, compras com valor acima de <strong>R$ {freeShippingMin.toLocaleString("pt-BR")}</strong> são elegíveis para frete grátis (frete selecionado conforme disponibilidade interna de menor custo).
          </p>
        </div>

        <div className="legal-contact-card">
          <h2>Precisa de Ajuda com a Entrega?</h2>
          <p>Se o seu pedido estiver com atraso no trânsito, ou caso precise alterar o endereço antes do envio, entre em contato imediatamente com o SAC:</p>
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
