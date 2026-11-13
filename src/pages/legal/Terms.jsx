import { Link } from 'react-router-dom'
import { LegalPage } from '@/pages/legal/LegalPage'
import { site } from '@/data/site'

export function Terms() {
  return (
    <LegalPage title="Termos de Uso" updatedAt="13/11/2026">
      <p>
        Estes Termos de Uso regulam a compra e o uso dos materiais digitais vendidos pela {site.name} no site{' '}
        {site.url}. Ao finalizar uma compra, você declara que leu e concorda com estes termos.
      </p>

      <h2>1. Quem somos</h2>
      <p>
        {site.name} vende atividades e materiais infantis em PDF, prontos para imprimir.
        {site.legalName && ` Responsável: ${site.legalName}.`}
        {site.document && ` CNPJ: ${site.document}.`} Contato: {site.email} ou WhatsApp {site.whatsappDisplay}.
      </p>

      <h2>2. Produtos e entrega</h2>
      <ul>
        <li>Todos os produtos são arquivos digitais em PDF. Nenhum item físico é enviado.</li>
        <li>
          Os kits/packs entregam o conjunto fixo de materiais descrito na página de cada kit.
        </li>
        <li>
          Após a confirmação do pagamento, os links de download aparecem na página de confirmação da compra e o link
          dessa página também é enviado para o e-mail informado no pagamento.
        </li>
        <li>
          Cada link de download vale por 30 minutos por segurança. Para gerar novos links, basta abrir de novo a
          página de confirmação pelo link do e-mail.
        </li>
        <li>
          Pagamentos com cartão costumam ser confirmados na hora. Pagamentos com Pix são liberados assim que a
          compensação é confirmada, normalmente em poucos minutos.
        </li>
      </ul>

      <h2>3. Preços e pagamento</h2>
      <p>
        Os preços estão em reais (R$) e podem mudar sem aviso, valendo sempre o preço exibido no momento da compra. O
        pagamento é processado pela Stripe, com cartão de crédito ou Pix. A {site.name} não recebe nem armazena os
        dados do seu cartão.
      </p>

      <h2>4. Licença de uso</h2>
      <ul>
        <li>
          Você pode imprimir os materiais quantas vezes quiser para uso pessoal, familiar ou com os seus alunos em
          sala de aula.
        </li>
        <li>
          Não é permitido revender, redistribuir, compartilhar os arquivos (gratuitamente ou não), publicá-los na
          internet ou apresentá-los como de sua autoria.
        </li>
        <li>Os direitos autorais dos materiais pertencem à {site.name}.</li>
      </ul>

      <h2>5. Direito de arrependimento e reembolso</h2>
      <p>
        Conforme o art. 49 do Código de Defesa do Consumidor, você pode desistir da compra em até{' '}
        <strong>7 (sete) dias corridos</strong> a contar da data do pagamento, sem precisar justificar.
      </p>
      <ul>
        <li>
          Para pedir, envie uma mensagem para {site.email} ou pelo WhatsApp {site.whatsappDisplay} informando o e-mail
          usado na compra.
        </li>
        <li>
          O valor pago é devolvido integralmente pelo mesmo meio de pagamento: estorno no cartão (o prazo para aparecer
          na fatura depende da operadora) ou devolução do Pix para a conta de origem.
        </li>
        <li>
          Com o reembolso, o acesso aos downloads da compra é encerrado e a licença de uso do item 4 deixa de valer;
          pedimos que os arquivos baixados sejam apagados.
        </li>
        <li>
          Se um arquivo vier com defeito ou diferente do anunciado, fale conosco a qualquer momento: substituímos o
          arquivo ou devolvemos o valor.
        </li>
      </ul>

      <h2>6. Responsabilidades</h2>
      <p>
        Os materiais são de apoio pedagógico e devem ser usados com acompanhamento de um adulto. A qualidade da
        impressão depende da impressora e do papel utilizados.
      </p>

      <h2>7. Privacidade</h2>
      <p>
        O tratamento dos seus dados pessoais está descrito na{' '}
        <Link to="/privacidade" className="font-semibold text-petrol underline">
          Política de Privacidade
        </Link>
        .
      </p>

      <h2>8. Alterações e foro</h2>
      <p>
        Estes termos podem ser atualizados; a versão válida para a sua compra é a publicada na data do pagamento. Fica
        eleito o foro do domicílio do consumidor para resolver qualquer questão relacionada a estes termos.
      </p>
    </LegalPage>
  )
}
