// Packs: cada pack entrega todos os PDFs listados em `items`
// (ver bundle_items em public.products e a função get-order-status).

export const mainPromotion = {
  id: "pack-completo",
  title: "Combo Completo Aprendemais",
  description: "Todos os 23 materiais do site: alfabetização, números, atividades, rotina e livros.",
  price: 59.9,
  // soma dos preços avulsos dos itens do pack
  oldPrice: 262.7,
  items: ["alfabeto-tracado", "vogais-tracado", "forme-silabas", "letra-inicial", "troca-letra", "qual-e-a-palavra", "aprende-cores", "aprende-quantidades", "aprende-operacoes", "mestre-das-formas", "arco-iris-das-emocoes", "caderno-de-missoes-especiais", "desafios-do-heroi", "labirinto-das-ideias", "exploradores-do-conhecimento", "kit-rotina", "placas-de-banheiro", "livro-de-colorir-biblico", "livro-de-colorir-ursinhos", "tchau-fraldinha-menino", "tchau-fraldinha-menina", "a-pascoa-de-ton", "meu-diario-com-deus"],
  emoji: "🏆",
  badge: "MELHOR OFERTA",
  scarcity: null,
}

export const promotions = [
  {
    id: "pack-alfabetizacao",
    title: "Kit Alfabetização",
    description: "Os 6 cadernos de alfabetização: alfabeto, vogais, sílabas, letra inicial, troca letra e palavras.",
    price: 29.9,
    // soma dos preços avulsos dos itens do pack
    oldPrice: 67.4,
    items: ["alfabeto-tracado", "vogais-tracado", "forme-silabas", "letra-inicial", "troca-letra", "qual-e-a-palavra"],
    emoji: "✏️",
    badge: "MAIS VENDIDO",
    accent: "petrol",
    scarcity: null,
  },
  {
    id: "pack-numeros-formas",
    title: "Kit Cores, Números e Formas",
    description: "Os 4 cadernos: cores, quantidades, operações e formas geométricas.",
    price: 19.9,
    // soma dos preços avulsos dos itens do pack
    oldPrice: 39.6,
    items: ["aprende-cores", "aprende-quantidades", "aprende-operacoes", "mestre-das-formas"],
    emoji: "🔢",
    badge: "KIT",
    accent: "mint",
    scarcity: null,
  },
  {
    id: "pack-fe",
    title: "Kit Fé",
    description: "Livro de Colorir Bíblico, Meu Diário com Deus e A Páscoa de Ton.",
    price: 24.9,
    // soma dos preços avulsos dos itens do pack
    oldPrice: 42.7,
    items: ["livro-de-colorir-biblico", "meu-diario-com-deus", "a-pascoa-de-ton"],
    emoji: "🙏",
    badge: "KIT",
    accent: "orange",
    scarcity: null,
  },
]
