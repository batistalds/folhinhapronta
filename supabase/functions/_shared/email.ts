// Envio de e-mail pela API do Resend (https://resend.com).
//
// Secrets usados (configurar com `supabase secrets set`):
//   RESEND_API_KEY  chave da API do Resend
//   EMAIL_FROM      remetente, ex.: "Folhinha Pronta <contato@folhinhapronta.com.br>"
//                   (o domínio precisa estar verificado no Resend)
//
// sendEmail nunca lança exceção: devolve true/false e registra o erro no log,
// para que uma falha de e-mail não quebre quem chamou (ex.: o webhook).

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') ?? ''

type EmailInput = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: EmailInput): Promise<boolean> {
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    console.warn('E-mail não enviado: RESEND_API_KEY ou EMAIL_FROM não configurados.')
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`Resend respondeu ${res.status}:`, await res.text())
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
