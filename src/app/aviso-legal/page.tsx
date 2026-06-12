import { getTenant } from "@/lib/tenant";
import { readStoreData } from "@/lib/store-data";

export const dynamic = "force-dynamic";

export default async function AvisoLegalPage() {
  const tenant = await getTenant();
  const store = readStoreData(tenant);

  const storeName = store.storeName;
  const email = `contato@${tenant === "localhost" ? storeName.toLowerCase().replace(/\s+/g, "") + ".com" : tenant}`;
  const siteUrl = tenant === "localhost" ? "http://localhost:3000" : `https://${tenant}`;
  const effectiveDate = store.legalEffectiveDate || "03 de maio de 2023";

  return (
    <main className="legal-container">
      <header className="legal-header">
        <h1 className="legal-title">Aviso Legal</h1>
        <p className="legal-meta">Data de Vigência: {effectiveDate}</p>
      </header>

      <div className="legal-content">
        <div className="legal-section">
          <h2>Apresentação</h2>
          <p>
            As informações contidas neste site são fornecidas pela <strong>{storeName}</strong> com o objetivo de apresentar seus produtos, condições de venda e políticas comerciais de forma clara e acessível. Ao acessar e utilizar este site, você concorda com os termos deste aviso.
          </p>
        </div>

        <div className="legal-section">
          <h2>1. Conteúdo Informativo</h2>
          <p>
            Todos os textos, imagens e descrições de produtos têm caráter meramente informativo. Embora nos esforcemos para manter as informações atualizadas e corretas, não garantimos a exatidão, integridade ou atualidade do conteúdo.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Produtos Comercializados</h2>
          <p>
            Os produtos comercializados pela <strong>{storeName}</strong>, especialmente itens de consumo, devem ser armazenados e consumidos conforme as orientações fornecidas na embalagem. Não nos responsabilizamos por problemas decorrentes de mau uso, armazenamento inadequado ou consumo fora do prazo de validade.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Links Externos</h2>
          <p>
            Este site pode conter links para sites de terceiros. A <strong>{storeName}</strong> não se responsabiliza pelo conteúdo, segurança, políticas ou práticas desses sites.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Direitos Autorais e Marcas</h2>
          <p>
            Todo o conteúdo deste site – incluindo logotipos, imagens, textos, gráficos e layout – é de propriedade exclusiva da <strong>{storeName}</strong> e está protegido por leis de direitos autorais. É proibida a reprodução total ou parcial sem autorização prévia e expressa.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Limitação de Responsabilidade</h2>
          <p>
            A <strong>{storeName}</strong> não se responsabiliza por:
          </p>
          <ul>
            <li>Danos diretos ou indiretos resultantes do uso ou da incapacidade de uso deste site;</li>
            <li>Falhas na transmissão de dados ou indisponibilidade temporária do sistema;</li>
            <li>Perdas decorrentes do uso indevido dos produtos após sua entrega.</li>
          </ul>
        </div>

        <div className="legal-contact-card">
          <h2>Contato</h2>
          <p>Para qualquer questão jurídica ou administrativa relacionada ao conteúdo deste aviso, entre em contato conosco:</p>
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
