// Envio de e-mail pela API transacional do Brevo (https://www.brevo.com).
// As Edge Functions bloqueiam SMTP, por isso o envio é via HTTP.
//
// Secrets usados (configurar com `supabase secrets set`):
//   BREVO_API_KEY       chave da API do Brevo (SMTP & API → API keys)
//   EMAIL_FROM_NAME     nome do remetente, ex.: "Folhinha Pronta"
//   EMAIL_FROM_ADDRESS  e-mail do remetente (verificado como sender no Brevo),
//                       ex.: folhinhapronta@gmail.com — também é o reply-to padrão
//
// sendEmail nunca lança exceção: retorna true/false e registra o erro no log,
// para que uma falha de e-mail não quebre quem chamou (ex.: o webhook).

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') ?? ''
const EMAIL_FROM_NAME = Deno.env.get('EMAIL_FROM_NAME') ?? 'Folhinha Pronta'
const EMAIL_FROM_ADDRESS = Deno.env.get('EMAIL_FROM_ADDRESS') ?? ''

type EmailInput = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: EmailInput): Promise<boolean> {
  if (!BREVO_API_KEY || !EMAIL_FROM_ADDRESS) {
    console.warn('E-mail não enviado: BREVO_API_KEY ou EMAIL_FROM_ADDRESS não configurados.')
    return false
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: EMAIL_FROM_NAME, email: EMAIL_FROM_ADDRESS },
        to: [{ email: to }],
        replyTo: { email: replyTo || EMAIL_FROM_ADDRESS },
        subject,
        htmlContent: html,
        textContent: text,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`Brevo respondeu ${res.status}:`, await res.text())
      return false
    }
    return true
  } catch (error) {
    console.error('Falha ao enviar e-mail:', error)
    return false
  }
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
