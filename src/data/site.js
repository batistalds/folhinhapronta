// Dados públicos da loja (rodapé, páginas legais, FAQ).
// O e-mail interno que recebe as mensagens NÃO fica aqui: ele é configurado só
// como secret no Supabase (CONTACT_EMAIL) e no encaminhamento do domínio.

export const site = {
  name: 'Folhinha Pronta',
  url: 'https://folhinhapronta.pages.dev',
  email: 'contato@folhinhapronta.com.br',
  whatsappDisplay: '(28) 99966-2398',
  whatsappLink: 'https://wa.me/5528999662398',
  // Preencher quando houver: razão social / nome do responsável e CNPJ.
  legalName: null,
  document: null,
}
