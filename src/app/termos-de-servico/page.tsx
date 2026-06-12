import { getTenant } from "@/lib/tenant";
import { readStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function TermosDeServicoPage() {
  const tenant = await getTenant();
  const store = readStoreData(tenant);

  const storeName = store.storeName;
  const email = `contato@${tenant === "localhost" ? storeName.toLowerCase().replace(/\s+/g, "") + ".com" : tenant}`;
  const siteUrl = tenant === "localhost" ? "http://localhost:3000" : `https://${tenant}`;
  const effectiveDate = store.legalEffectiveDate || "03 de maio de 2023";

  return (
    <main className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">Termos de Serviço</h1>
        <p className="legal-meta">Data de Vigência: {effectiveDate}</p>
      </header>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Termos e Condições Gerais</h2>
          <p>
            Bem-vindo à <strong>{storeName}</strong>. Ao acessar e efetuar compras em nosso site, você concorda com as condições descritas abaixo. Se você não concorda com qualquer parte destes termos, não deve acessar nosso site nem adquirir nossos produtos.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Cadastro e Acesso</h2>
          <p>
            Para realizar compras no site, o usuário deve preencher as informações de identificação solicitadas no checkout com dados exatos, precisos e verdadeiros. A <strong>{storeName}</strong> reserva-se o direito de recusar ou cancelar qualquer pedido caso detecte dados inconsistentes ou indícios de fraude.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Produtos, Preços e Disponibilidade</h2>
          <p>
            Os preços e condições exibidos são válidos exclusivamente para compras realizadas no site e estão sujeitos a alterações sem aviso prévio. Nós nos esforçamos para garantir que todas as descrições e imagens sejam o mais fiéis possíveis aos produtos, contudo, variações de cor e detalhes podem ocorrer dependendo do lote do fabricante ou calibração de sua tela.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Pagamentos e Cobrança</h2>
          <p>
            Oferecemos suporte a múltiplos meios de pagamento, como Pix, Cartão de Crédito e Boleto Bancário. O processamento das transações de pagamento é efetuado por parceiros financeiros homologados pela <strong>{storeName}</strong>. A confirmação do pedido ocorrerá mediante a validação e compensação da respectiva transação financeira.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Entregas, Envios e Rastreamento</h2>
          <p>
            As entregas são feitas por transportadoras parceiras e pelos Correios. O prazo de entrega estimado é exibido durante a etapa de checkout e passa a contar a partir da aprovação do pagamento. O cliente receberá um código de rastreamento no e-mail cadastrado para acompanhar o andamento da entrega.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Política de Trocas, Devoluções e Direito de Arrependimento</h2>
          <p>
            Em cumprimento ao artigo 49 do Código de Defesa do Consumidor (CDC), o cliente tem o direito de desistir da compra no prazo de até 7 (sete) dias corridos a contar da data de recebimento do produto, obtendo o reembolso integral dos valores pagos. Para maiores detalhes sobre as regras, consulte nossa Política de Reembolso dedicada.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Propriedade Intelectual</h2>
          <p>
            Todo o material visual, marcas comerciais, designs, fotografias e textos contidos na plataforma são de propriedade industrial e autoral da <strong>{storeName}</strong>. A cópia, reprodução ou uso comercial não autorizado de qualquer conteúdo deste site é expressamente proibido.
          </p>
        </div>

        <div className="legal-contact-card">
          <h2>Fale Conosco</h2>
          <p>Se restarem dúvidas sobre nossos Termos de Serviço ou se desejar suporte adicional, sinta-se à vontade para entrar em contato:</p>
          <div className="legal-contact-info">
            <a href={`mailto:${email}`} className="legal-contact-item">
              📧 {email}
            </a>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="legal-contact-item">
              🌐 Site: {siteUrl.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
