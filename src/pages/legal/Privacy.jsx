import { LegalPage } from '@/pages/legal/LegalPage'
import { site } from '@/data/site'

export function Privacy() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="13/11/2026">
      <p>
        Esta política explica quais dados pessoais a {site.name} trata, para quê e quais são os seus direitos, de
        acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>1. Controlador e contato</h2>
      <p>
        O controlador dos dados é a {site.name}
        {site.legalName && ` (${site.legalName}`}
        {site.document && `, CNPJ ${site.document}`}
        {site.legalName && ')'}. Para qualquer assunto sobre seus dados, fale conosco pelo e-mail {site.email} ou pelo
        WhatsApp {site.whatsappDisplay}.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>Na compra:</strong> seu e-mail e os itens comprados, com valor, data e situação do pedido. Nome,
          dados do cartão e dados do Pix são informados diretamente na página de pagamento da Stripe — a{' '}
          {site.name} não recebe nem armazena o número do cartão.
        </li>
        <li>
          <strong>Quando você entra em contato:</strong> nome, e-mail ou telefone e o conteúdo da mensagem.
        </li>
        <li>
          <strong>Navegação:</strong> o carrinho fica salvo apenas no seu navegador (armazenamento da sessão) e é
          apagado ao fechar a aba. Não usamos cookies de publicidade nem ferramentas de rastreamento. Os provedores
          de hospedagem podem registrar dados técnicos, como endereço IP, por segurança.
        </li>
      </ul>

      <h2>3. Para que usamos os dados</h2>
      <ul>
        <li>Processar o pagamento e entregar os materiais comprados (execução de contrato).</li>
        <li>Enviar o e-mail com o link de download e responder às suas solicitações de suporte e reembolso.</li>
        <li>Cumprir obrigações legais e fiscais e prevenir fraudes.</li>
      </ul>
      <p>Não vendemos seus dados e não enviamos propaganda sem o seu consentimento.</p>

      <h2>4. Com quem os dados são compartilhados</h2>
      <p>Usamos fornecedores (operadores) que tratam dados em nosso nome apenas para operar a loja:</p>
      <ul>
        <li><strong>Stripe</strong> — processamento de pagamentos (cartão e Pix).</li>
        <li><strong>Supabase</strong> — banco de dados dos pedidos e armazenamento dos arquivos.</li>
        <li><strong>Cloudflare</strong> — hospedagem do site.</li>
        <li><strong>Brevo</strong> — envio dos e-mails de confirmação da compra.</li>
      </ul>
      <p>
        Alguns desses fornecedores armazenam dados em servidores fora do Brasil, com garantias de proteção
        compatíveis com a LGPD (art. 33).
      </p>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>
        Os dados dos pedidos são mantidos pelo prazo exigido pela legislação fiscal e de defesa do consumidor
        (em geral, 5 anos). Mensagens de contato são mantidas enquanto forem necessárias para atender ao pedido.
      </p>

      <h2>6. Seus direitos</h2>
      <p>Você pode, a qualquer momento, pedir:</p>
      <ul>
        <li>confirmação de que tratamos seus dados e acesso a eles;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>
          exclusão dos dados, exceto os que precisamos manter por obrigação legal (por exemplo, registros fiscais da
          compra);
        </li>
        <li>informações sobre com quem compartilhamos seus dados.</li>
      </ul>
      <p>
        Para exercer esses direitos, envie um e-mail para {site.email} ou mensagem pelo WhatsApp{' '}
        {site.whatsappDisplay}, informando o e-mail usado na compra. Respondemos em até 15 dias. Você também pode
        reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>7. Segurança</h2>
      <p>
        Os arquivos ficam em armazenamento privado, liberados apenas por links temporários após a confirmação do
        pagamento, e o acesso ao banco de dados é restrito.
      </p>

      <h2>8. Alterações</h2>
      <p>Esta política pode ser atualizada. A data da última atualização aparece no topo da página.</p>
    </LegalPage>
  )
}
