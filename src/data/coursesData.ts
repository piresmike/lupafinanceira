export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  durationMinutes: number;
  level: "Iniciante" | "Intermediário" | "Avançado";
  content: CourseContent;
}

export interface CourseContent {
  introduction: string;
  sections: CourseSection[];
  keyLearnings: string[];
  nextSteps: string;
}

export interface CourseSection {
  title: string;
  content: string;
  bullets?: string[];
  tip?: { type: "tip" | "warning"; text: string };
}

export interface CourseCompletion {
  courseId: string;
  courseSlug: string;
  courseName: string;
  completedAt: Date;
  readingTimeMinutes: number;
}

export const coursesData: Course[] = [
  {
    id: "1",
    slug: "introducao-mercado-acoes",
    title: "Introdução ao Mercado de Ações",
    description: "Entenda como funciona a bolsa de valores, o que são ações e como começar a investir com segurança.",
    icon: "📈",
    durationMinutes: 15,
    level: "Iniciante",
    content: {
      introduction: "Investir em ações pode parecer complicado à primeira vista, mas com o conhecimento certo, você pode tomar decisões informadas e construir patrimônio ao longo do tempo. Neste curso, vamos descomplicar o mercado de ações e mostrar como você pode começar a investir com segurança e confiança.",
      sections: [
        {
          title: "O Que São Ações?",
          content: "Ações são pequenas partes de uma empresa. Quando você compra uma ação, você se torna sócio daquela empresa, mesmo que seja uma participação muito pequena. Isso significa que você tem direito a uma parte dos lucros (através de dividendos) e pode ganhar dinheiro se o valor da empresa aumentar e você vender suas ações por um preço maior do que pagou.",
          bullets: [
            "Ações Ordinárias (ON): Dão direito a voto nas assembleias da empresa. Geralmente terminam com o número 3 (ex: PETR3).",
            "Ações Preferenciais (PN): Têm preferência no recebimento de dividendos, mas não dão direito a voto. Geralmente terminam com o número 4 (ex: PETR4)."
          ]
        },
        {
          title: "Como Funciona a Bolsa de Valores?",
          content: "A bolsa de valores é como um mercado onde ações são compradas e vendidas. No Brasil, a principal bolsa é a B3 (Brasil, Bolsa, Balcão). As negociações acontecem de segunda a sexta, das 10h às 17h (horário de Brasília). O preço das ações varia constantemente, baseado na oferta e demanda: se muitas pessoas querem comprar uma ação, o preço sobe; se muitas pessoas querem vender, o preço cai. O Ibovespa é o principal índice da B3, mostrando o desempenho médio das ações mais negociadas.",
          tip: {
            type: "tip",
            text: "Não se assuste com a volatilidade (variação de preços). É normal e faz parte do mercado. Investidores de sucesso pensam no longo prazo e não tomam decisões emocionais baseadas em oscilações diárias."
          }
        },
        {
          title: "Como Começar a Investir",
          content: "Para investir em ações, você precisa seguir alguns passos simples. Não existe valor mínimo obrigatório - você pode começar com R$ 100 ou até menos, comprando frações de ações (mercado fracionário).",
          bullets: [
            "Abrir conta em uma corretora de valores (XP, Rico, Clear, BTG, etc.)",
            "Transferir dinheiro para sua conta",
            "Usar a plataforma da corretora (app ou site) para comprar ações",
            "Acompanhar seus investimentos regularmente"
          ],
          tip: {
            type: "warning",
            text: "Nunca invista dinheiro que você pode precisar no curto prazo. O mercado de ações é recomendado para objetivos de médio e longo prazo (acima de 3-5 anos). Tenha sempre uma reserva de emergência em investimentos mais seguros antes de entrar na bolsa."
          }
        }
      ],
      keyLearnings: [
        "Ações são partes de empresas e permitem que você se torne sócio",
        "O preço das ações varia com base em oferta e demanda",
        "Existem ações ordinárias (ON) e preferenciais (PN)",
        "Você precisa de uma corretora para investir na bolsa",
        "Investimentos em ações são para médio/longo prazo"
      ],
      nextSteps: "Agora que você entende o básico sobre ações, que tal aprender sobre como analisar empresas? Recomendamos o curso \"Como Ler um Balanço Patrimonial\" para aprofundar seus conhecimentos!"
    }
  },
  {
    id: "2",
    slug: "como-ler-balanco-patrimonial",
    title: "Como Ler um Balanço Patrimonial",
    description: "Aprenda a interpretar demonstrações financeiras e avaliar a saúde de uma empresa antes de investir.",
    icon: "📊",
    durationMinutes: 20,
    level: "Intermediário",
    content: {
      introduction: "O balanço patrimonial é como uma fotografia da saúde financeira de uma empresa em um determinado momento. Saber interpretá-lo é essencial para qualquer investidor que queira tomar decisões informadas sobre onde alocar seu dinheiro.",
      sections: [
        {
          title: "O Que é um Balanço Patrimonial?",
          content: "O balanço patrimonial é um relatório contábil que mostra a posição financeira de uma empresa em uma data específica. Ele é dividido em três partes principais que sempre devem se equilibrar: Ativos = Passivos + Patrimônio Líquido.",
          bullets: [
            "Ativos: Tudo que a empresa possui (dinheiro, imóveis, equipamentos, estoques)",
            "Passivos: Tudo que a empresa deve (dívidas, empréstimos, obrigações)",
            "Patrimônio Líquido: O que sobra para os acionistas (Ativos - Passivos)"
          ]
        },
        {
          title: "Analisando os Ativos",
          content: "Os ativos são divididos em circulantes (curto prazo) e não circulantes (longo prazo). Ativos circulantes podem ser convertidos em dinheiro em até 12 meses, como caixa, contas a receber e estoques. Ativos não circulantes são investimentos de longo prazo, como imóveis, máquinas e patentes.",
          tip: {
            type: "tip",
            text: "Uma empresa com mais ativos circulantes do que passivos circulantes geralmente tem boa liquidez, ou seja, capacidade de pagar suas contas no curto prazo."
          }
        },
        {
          title: "Entendendo os Passivos",
          content: "Assim como os ativos, os passivos também são divididos em circulantes e não circulantes. Passivos circulantes são dívidas que vencem em até 12 meses, enquanto passivos não circulantes são dívidas de longo prazo. É importante analisar o nível de endividamento da empresa.",
          bullets: [
            "Passivos circulantes: fornecedores, salários, impostos a pagar",
            "Passivos não circulantes: empréstimos de longo prazo, debêntures",
            "Compare passivos com o patrimônio líquido para avaliar o endividamento"
          ],
          tip: {
            type: "warning",
            text: "Empresas muito endividadas podem ter dificuldades em momentos de crise. Analise a relação dívida/patrimônio antes de investir."
          }
        },
        {
          title: "Indicadores Importantes",
          content: "Existem diversos indicadores que podem ser calculados a partir do balanço patrimonial para avaliar a saúde financeira da empresa.",
          bullets: [
            "Liquidez Corrente = Ativo Circulante / Passivo Circulante (ideal > 1)",
            "Endividamento = Passivo Total / Patrimônio Líquido (quanto menor, melhor)",
            "ROE = Lucro Líquido / Patrimônio Líquido (retorno sobre o patrimônio)"
          ]
        }
      ],
      keyLearnings: [
        "O balanço patrimonial mostra Ativos, Passivos e Patrimônio Líquido",
        "Ativos são o que a empresa possui, Passivos são o que ela deve",
        "Patrimônio Líquido representa o valor dos acionistas",
        "Liquidez corrente indica capacidade de pagar dívidas de curto prazo",
        "O nível de endividamento revela o risco financeiro da empresa"
      ],
      nextSteps: "Com esse conhecimento, você já pode começar a analisar empresas antes de investir. O próximo passo é entender os diferentes tipos de fundos de investimento no curso \"Fundos de Investimento para Iniciantes\"."
    }
  },
  {
    id: "3",
    slug: "fundos-investimento-iniciantes",
    title: "Fundos de Investimento para Iniciantes",
    description: "Conheça os diferentes tipos de fundos, taxas envolvidas e como escolher o melhor para seu perfil.",
    icon: "💼",
    durationMinutes: 12,
    level: "Iniciante",
    content: {
      introduction: "Fundos de investimento são uma forma prática de diversificar seus investimentos sem precisar escolher cada ativo individualmente. Um gestor profissional faz isso por você, seguindo uma estratégia definida.",
      sections: [
        {
          title: "O Que São Fundos de Investimento?",
          content: "Um fundo de investimento funciona como um condomínio: várias pessoas colocam dinheiro junto, e um gestor profissional decide onde investir. Cada investidor possui cotas do fundo, que representam sua participação no total.",
          bullets: [
            "Cotistas: investidores que aplicam dinheiro no fundo",
            "Gestor: profissional que toma as decisões de investimento",
            "Administrador: empresa responsável pela parte burocrática",
            "Custodiante: guarda os ativos do fundo com segurança"
          ]
        },
        {
          title: "Tipos de Fundos",
          content: "Existem diversos tipos de fundos, cada um com características e objetivos diferentes. A escolha depende do seu perfil de risco e objetivos financeiros.",
          bullets: [
            "Renda Fixa: investem em títulos de renda fixa, menor risco",
            "Ações: investem majoritariamente em ações, maior risco e potencial de retorno",
            "Multimercado: combinam diferentes tipos de ativos",
            "Imobiliários (FIIs): investem em imóveis e pagam rendimentos mensais",
            "Cambiais: acompanham moedas estrangeiras como dólar"
          ],
          tip: {
            type: "tip",
            text: "Para iniciantes, fundos de renda fixa ou multimercado conservadores são boas opções para começar a entender o funcionamento dos fundos."
          }
        },
        {
          title: "Taxas e Custos",
          content: "É fundamental entender as taxas antes de investir em qualquer fundo, pois elas impactam diretamente sua rentabilidade.",
          bullets: [
            "Taxa de Administração: cobrada anualmente para remunerar o gestor (0,5% a 2% ao ano)",
            "Taxa de Performance: cobrada quando o fundo supera um benchmark (geralmente 20% do que exceder)",
            "Come-cotas: antecipação de IR nos fundos de renda fixa e multimercado (maio e novembro)"
          ],
          tip: {
            type: "warning",
            text: "Taxas altas podem consumir grande parte dos seus rendimentos ao longo do tempo. Compare sempre as taxas antes de escolher um fundo."
          }
        }
      ],
      keyLearnings: [
        "Fundos permitem diversificação com gestão profissional",
        "Existem diferentes tipos para cada perfil de risco",
        "Taxa de administração é cobrada anualmente",
        "Taxa de performance só é cobrada quando o fundo supera o benchmark",
        "Fundos de renda fixa são mais conservadores que fundos de ações"
      ],
      nextSteps: "Agora que você conhece os fundos, que tal aprender sobre análise técnica? O curso \"Análise Técnica: Os Fundamentos\" vai te ensinar a ler gráficos!"
    }
  },
  {
    id: "4",
    slug: "analise-tecnica-fundamentos",
    title: "Análise Técnica: Os Fundamentos",
    description: "Introdução aos principais indicadores técnicos, gráficos e padrões usados por traders profissionais.",
    icon: "📉",
    durationMinutes: 25,
    level: "Intermediário",
    content: {
      introduction: "A análise técnica é o estudo dos movimentos de preços através de gráficos para prever tendências futuras. Diferente da análise fundamentalista, ela foca no comportamento do mercado, não nos fundamentos da empresa.",
      sections: [
        {
          title: "Princípios da Análise Técnica",
          content: "A análise técnica se baseia em três premissas fundamentais que todo trader deve conhecer antes de começar a operar.",
          bullets: [
            "O preço desconta tudo: todas as informações já estão refletidas no preço",
            "Os preços se movem em tendências: alta, baixa ou lateral",
            "A história se repete: padrões de comportamento tendem a se repetir"
          ]
        },
        {
          title: "Tipos de Gráficos",
          content: "Existem diferentes formas de visualizar os movimentos de preços. Cada tipo de gráfico oferece informações específicas para análise.",
          bullets: [
            "Gráfico de Linhas: conecta os preços de fechamento, simples e limpo",
            "Gráfico de Barras: mostra abertura, fechamento, máxima e mínima",
            "Candlesticks: o mais popular, fácil visualização de padrões"
          ],
          tip: {
            type: "tip",
            text: "Os candlesticks (velas) são os preferidos da maioria dos traders por mostrarem claramente se o preço subiu (vela verde/branca) ou caiu (vela vermelha/preta) no período."
          }
        },
        {
          title: "Suportes e Resistências",
          content: "Suportes são níveis de preço onde há tendência de compra (o preço para de cair). Resistências são níveis onde há tendência de venda (o preço para de subir). Identificar esses pontos é fundamental para definir pontos de entrada e saída.",
          tip: {
            type: "warning",
            text: "Quando um suporte é rompido, ele geralmente se torna uma resistência, e vice-versa. Isso é chamado de \"inversão de polaridade\"."
          }
        },
        {
          title: "Indicadores Básicos",
          content: "Indicadores técnicos são cálculos matemáticos baseados no preço e volume que ajudam a identificar tendências e pontos de reversão.",
          bullets: [
            "Médias Móveis: suavizam o preço e mostram a tendência geral",
            "IFR (RSI): indica se um ativo está sobrecomprado ou sobrevendido",
            "MACD: mostra a força e direção da tendência",
            "Bandas de Bollinger: indicam volatilidade e possíveis reversões"
          ]
        }
      ],
      keyLearnings: [
        "A análise técnica estuda gráficos para prever movimentos futuros",
        "Candlesticks são o tipo de gráfico mais utilizado por traders",
        "Suportes e resistências são níveis-chave para decisões de trade",
        "Médias móveis ajudam a identificar a tendência do mercado",
        "Indicadores como RSI mostram quando um ativo pode estar esticado"
      ],
      nextSteps: "A análise técnica é uma ferramenta poderosa, mas não deve ser usada sozinha. Combine com a diversificação de portfólio no próximo curso!"
    }
  },
  {
    id: "5",
    slug: "diversificacao-portfolio",
    title: "Diversificação de Portfólio",
    description: "Estratégias para distribuir seus investimentos e reduzir riscos sem comprometer rentabilidade.",
    icon: "🎯",
    durationMinutes: 18,
    level: "Iniciante",
    content: {
      introduction: "\"Não coloque todos os ovos na mesma cesta\" - esse ditado resume perfeitamente o conceito de diversificação. Distribuir seus investimentos entre diferentes ativos é a melhor forma de reduzir riscos.",
      sections: [
        {
          title: "Por Que Diversificar?",
          content: "A diversificação é a única estratégia de investimento que oferece benefícios sem custos adicionais. Ao distribuir seu dinheiro entre diferentes ativos, você reduz o risco de perder tudo caso um investimento dê errado.",
          bullets: [
            "Reduz o risco específico de cada ativo",
            "Suaviza os retornos ao longo do tempo",
            "Protege contra eventos inesperados em setores específicos",
            "Permite capturar oportunidades em diferentes mercados"
          ]
        },
        {
          title: "Tipos de Diversificação",
          content: "Existem várias formas de diversificar sua carteira, e o ideal é combinar múltiplas estratégias.",
          bullets: [
            "Por classe de ativos: ações, renda fixa, imóveis, criptomoedas",
            "Por setor: bancos, varejo, tecnologia, energia, saúde",
            "Por geografia: Brasil, EUA, Europa, mercados emergentes",
            "Por prazo: curto, médio e longo prazo"
          ],
          tip: {
            type: "tip",
            text: "Uma carteira bem diversificada geralmente tem entre 15 e 25 ativos. Menos que isso pode ser arriscado; mais que isso pode ser difícil de acompanhar."
          }
        },
        {
          title: "Correlação Entre Ativos",
          content: "A chave para uma boa diversificação é escolher ativos que não se movam sempre na mesma direção (baixa correlação). Se tudo sobe e desce junto, você não está realmente diversificado.",
          bullets: [
            "Correlação positiva: ativos que sobem e descem juntos",
            "Correlação negativa: quando um sobe, o outro tende a cair",
            "Correlação zero: movimentos independentes"
          ],
          tip: {
            type: "warning",
            text: "Em momentos de crise, a correlação entre ativos tende a aumentar. Por isso, é importante ter ativos de proteção como ouro ou dólar."
          }
        },
        {
          title: "Rebalanceamento",
          content: "Com o tempo, alguns ativos vão performar melhor que outros, mudando as proporções da sua carteira. Rebalancear significa vender um pouco do que subiu muito e comprar mais do que caiu, mantendo sua estratégia original."
        }
      ],
      keyLearnings: [
        "Diversificação reduz riscos sem reduzir retornos esperados",
        "Diversifique por classe de ativos, setores e geografia",
        "Escolha ativos com baixa correlação entre si",
        "Mantenha entre 15 e 25 ativos na carteira",
        "Rebalanceie periodicamente para manter sua estratégia"
      ],
      nextSteps: "Para uma carteira equilibrada, você precisa entender bem renda fixa. Confira o curso \"Renda Fixa: Títulos Públicos e Privados\"!"
    }
  },
  {
    id: "6",
    slug: "renda-fixa-titulos",
    title: "Renda Fixa: Títulos Públicos e Privados",
    description: "Entenda CDBs, LCIs, LCAs, Tesouro Direto e como escolher os melhores títulos de renda fixa.",
    icon: "🏦",
    durationMinutes: 22,
    level: "Iniciante",
    content: {
      introduction: "Renda fixa é a base de qualquer carteira de investimentos. São investimentos onde você sabe, no momento da aplicação, como será calculado seu rendimento. São mais seguros que renda variável e ideais para objetivos de curto e médio prazo.",
      sections: [
        {
          title: "O Que é Renda Fixa?",
          content: "Na renda fixa, você empresta dinheiro para alguém (governo, banco ou empresa) e recebe juros por isso. O termo \"fixa\" se refere à forma de cálculo do rendimento, que é definida no momento da aplicação.",
          bullets: [
            "Prefixado: taxa de juros definida no momento da aplicação",
            "Pós-fixado: rendimento atrelado a um indicador (CDI, Selic, IPCA)",
            "Híbrido: combina uma taxa fixa + indicador de inflação"
          ]
        },
        {
          title: "Tesouro Direto",
          content: "O Tesouro Direto permite que você compre títulos públicos federais, considerados os investimentos mais seguros do país. Afinal, é o próprio governo federal que garante o pagamento.",
          bullets: [
            "Tesouro Selic: pós-fixado, ideal para reserva de emergência",
            "Tesouro Prefixado: taxa fixa, bom quando juros devem cair",
            "Tesouro IPCA+: protege contra inflação, ideal para longo prazo"
          ],
          tip: {
            type: "tip",
            text: "O Tesouro Selic tem liquidez diária e é perfeito para sua reserva de emergência. Você pode resgatar a qualquer momento sem perder dinheiro."
          }
        },
        {
          title: "Títulos Privados",
          content: "Bancos e empresas também emitem títulos de renda fixa. Geralmente pagam mais que o Tesouro Direto, mas têm mais risco.",
          bullets: [
            "CDB: Certificado de Depósito Bancário, emitido por bancos",
            "LCI/LCA: isentos de IR para pessoa física, emitidos por bancos",
            "Debêntures: emitidas por empresas, podem ou não ser isentas de IR",
            "CRI/CRA: títulos do setor imobiliário e do agronegócio"
          ],
          tip: {
            type: "warning",
            text: "CDBs, LCIs e LCAs são protegidos pelo FGC (Fundo Garantidor de Créditos) até R$ 250.000 por instituição. Debêntures não têm essa proteção."
          }
        },
        {
          title: "Como Escolher?",
          content: "A escolha depende do seu objetivo, prazo e perfil de risco. Para reserva de emergência, prefira liquidez diária. Para objetivos de longo prazo, títulos atrelados à inflação são interessantes.",
          bullets: [
            "Curto prazo (até 1 ano): Tesouro Selic ou CDB com liquidez",
            "Médio prazo (1-5 anos): CDBs, LCIs, LCAs",
            "Longo prazo (5+ anos): Tesouro IPCA+ ou debêntures incentivadas"
          ]
        }
      ],
      keyLearnings: [
        "Renda fixa é mais segura e previsível que renda variável",
        "Tesouro Direto é garantido pelo governo federal",
        "CDBs, LCIs e LCAs têm proteção do FGC até R$ 250 mil",
        "LCIs e LCAs são isentos de Imposto de Renda",
        "Tesouro Selic é ideal para reserva de emergência"
      ],
      nextSteps: "Quer diversificar ainda mais? Conheça o mundo das criptomoedas no curso \"Criptomoedas: Conceitos Básicos\"!"
    }
  },
  {
    id: "7",
    slug: "criptomoedas-conceitos",
    title: "Criptomoedas: Conceitos Básicos",
    description: "O que são criptomoedas, blockchain, como funcionam e os principais cuidados ao investir.",
    icon: "₿",
    durationMinutes: 20,
    level: "Iniciante",
    content: {
      introduction: "Criptomoedas são uma revolução no mundo financeiro. Desde o lançamento do Bitcoin em 2009, esse mercado cresceu exponencialmente, atraindo investidores de todos os perfis. Mas antes de investir, é essencial entender como funciona.",
      sections: [
        {
          title: "O Que São Criptomoedas?",
          content: "Criptomoedas são moedas digitais que usam criptografia para garantir segurança e operam de forma descentralizada, sem necessidade de bancos ou governos. Elas existem apenas no mundo digital e são registradas em um livro-razão público chamado blockchain.",
          bullets: [
            "Bitcoin (BTC): a primeira e mais conhecida criptomoeda",
            "Ethereum (ETH): permite contratos inteligentes e aplicações",
            "Stablecoins: moedas pareadas ao dólar (USDT, USDC)",
            "Altcoins: todas as outras criptomoedas além do Bitcoin"
          ]
        },
        {
          title: "O Que é Blockchain?",
          content: "Blockchain é a tecnologia por trás das criptomoedas. É como um livro contábil digital, público e imutável, onde todas as transações são registradas em blocos encadeados. Uma vez registrada, uma transação não pode ser alterada ou apagada.",
          tip: {
            type: "tip",
            text: "Pense no blockchain como um histórico de todas as transações que qualquer pessoa pode verificar, mas ninguém pode alterar. Isso garante transparência e segurança."
          }
        },
        {
          title: "Como Investir em Criptomoedas?",
          content: "Existem diferentes formas de investir em criptomoedas, desde comprar diretamente até investir através de fundos regulamentados.",
          bullets: [
            "Exchanges: plataformas como Binance, Mercado Bitcoin, Coinbase",
            "ETFs de criptomoedas: fundos negociados na B3 (ex: HASH11)",
            "Fundos de investimento: gestão profissional, mas com taxas",
            "Carteiras (wallets): para guardar suas moedas com segurança"
          ],
          tip: {
            type: "warning",
            text: "NUNCA compartilhe sua frase de recuperação (seed phrase) com ninguém! Quem tem acesso a ela pode roubar todas as suas criptomoedas."
          }
        },
        {
          title: "Riscos e Cuidados",
          content: "O mercado de criptomoedas é altamente volátil e especulativo. É possível ter ganhos expressivos, mas também perdas significativas em pouco tempo.",
          bullets: [
            "Volatilidade extrema: oscilações de 10-20% em um dia são comuns",
            "Golpes e fraudes: promessas de ganhos garantidos são sempre mentira",
            "Regulamentação incerta: regras podem mudar a qualquer momento",
            "Perda de acesso: se perder suas chaves, perde as moedas para sempre"
          ]
        }
      ],
      keyLearnings: [
        "Criptomoedas são moedas digitais descentralizadas",
        "Blockchain é a tecnologia que garante segurança e transparência",
        "Bitcoin e Ethereum são as principais criptomoedas",
        "Volatilidade é muito maior que investimentos tradicionais",
        "Nunca invista mais do que está disposto a perder"
      ],
      nextSteps: "Agora que você conhece os principais tipos de investimentos, aprenda a montar sua carteira no curso \"Como Montar uma Carteira de Investimentos\"!"
    }
  },
  {
    id: "8",
    slug: "montar-carteira-investimentos",
    title: "Como Montar uma Carteira de Investimentos",
    description: "Passo a passo para construir uma carteira balanceada de acordo com seus objetivos e perfil de risco.",
    icon: "🗂️",
    durationMinutes: 18,
    level: "Intermediário",
    content: {
      introduction: "Montar uma carteira de investimentos é como construir uma casa: você precisa de uma boa fundação, estrutura sólida e acabamento adequado. Neste curso, vamos criar um passo a passo prático para você construir sua carteira ideal.",
      sections: [
        {
          title: "Passo 1: Defina Seus Objetivos",
          content: "Antes de investir qualquer centavo, você precisa saber POR QUE está investindo. Objetivos diferentes exigem estratégias diferentes.",
          bullets: [
            "Reserva de emergência: 6-12 meses de gastos, liquidez imediata",
            "Curto prazo (até 2 anos): viagem, compras grandes",
            "Médio prazo (2-5 anos): entrada de imóvel, carro",
            "Longo prazo (5+ anos): aposentadoria, independência financeira"
          ],
          tip: {
            type: "tip",
            text: "Comece SEMPRE pela reserva de emergência. Sem ela, você pode ser forçado a vender investimentos de longo prazo em momentos ruins."
          }
        },
        {
          title: "Passo 2: Conheça Seu Perfil de Risco",
          content: "Seu perfil de investidor define quanto risco você consegue tolerar. Não adianta ter uma carteira agressiva se você perde o sono quando o mercado cai.",
          bullets: [
            "Conservador: prioriza segurança, aceita menor rentabilidade",
            "Moderado: busca equilíbrio entre segurança e crescimento",
            "Arrojado: aceita volatilidade em busca de maiores retornos"
          ]
        },
        {
          title: "Passo 3: Defina a Alocação de Ativos",
          content: "A alocação de ativos é a divisão do seu dinheiro entre diferentes classes de investimentos. Esta é a decisão mais importante da sua carteira.",
          bullets: [
            "Conservador: 80% renda fixa, 15% ações, 5% alternativos",
            "Moderado: 50% renda fixa, 40% ações, 10% alternativos",
            "Arrojado: 20% renda fixa, 60% ações, 20% alternativos"
          ],
          tip: {
            type: "warning",
            text: "A regra dos 100: subtraia sua idade de 100 para ter uma ideia da porcentagem máxima em renda variável. Aos 30 anos = 70% máximo em ações."
          }
        },
        {
          title: "Passo 4: Escolha os Ativos",
          content: "Com a alocação definida, escolha ativos específicos para cada classe. Diversifique dentro de cada categoria para reduzir riscos.",
          bullets: [
            "Renda fixa: Tesouro Direto, CDBs, LCIs, LCAs",
            "Ações: empresas de diferentes setores, ETFs (BOVA11, IVVB11)",
            "Fundos Imobiliários: FIIs de diferentes tipos (tijolo, papel, híbrido)",
            "Alternativos: ouro, criptomoedas, dólar"
          ]
        },
        {
          title: "Passo 5: Monitore e Rebalanceie",
          content: "Sua carteira vai mudar naturalmente com o tempo. Ativos que performam bem aumentam sua participação, e vice-versa. Rebalanceie periodicamente para manter sua estratégia original."
        }
      ],
      keyLearnings: [
        "Defina objetivos claros antes de começar a investir",
        "Sua alocação deve refletir seu perfil de risco",
        "Comece sempre pela reserva de emergência",
        "Diversifique dentro de cada classe de ativos",
        "Rebalanceie a carteira pelo menos uma vez por ano"
      ],
      nextSteps: "Para tomar melhores decisões, você precisa entender os indicadores econômicos. Confira o curso \"Indicadores Econômicos Essenciais\"!"
    }
  },
  {
    id: "9",
    slug: "indicadores-economicos",
    title: "Indicadores Econômicos Essenciais",
    description: "PIB, inflação, taxa Selic, câmbio: entenda os indicadores que movem o mercado e afetam seus investimentos.",
    icon: "📰",
    durationMinutes: 16,
    level: "Iniciante",
    content: {
      introduction: "Os indicadores econômicos são como sinais vitais da economia. Assim como um médico analisa pressão e temperatura para entender a saúde de um paciente, investidores analisam indicadores para entender o ambiente econômico.",
      sections: [
        {
          title: "PIB - Produto Interno Bruto",
          content: "O PIB representa a soma de tudo que é produzido em um país durante um período. É o principal indicador do tamanho e crescimento da economia. PIB crescendo significa economia aquecida; PIB caindo pode indicar recessão.",
          bullets: [
            "PIB nominal: valor total em reais",
            "PIB real: descontada a inflação, mostra crescimento real",
            "PIB per capita: PIB dividido pela população"
          ],
          tip: {
            type: "tip",
            text: "Dois trimestres consecutivos de queda no PIB caracterizam uma recessão técnica."
          }
        },
        {
          title: "Inflação (IPCA e IGP-M)",
          content: "Inflação é o aumento generalizado dos preços. Corrói o poder de compra do seu dinheiro ao longo do tempo. Por isso, seus investimentos precisam render MAIS que a inflação para você ter ganho real.",
          bullets: [
            "IPCA: índice oficial de inflação, usado pelo Banco Central",
            "IGP-M: muito usado em contratos de aluguel",
            "INPC: foca em famílias de menor renda"
          ],
          tip: {
            type: "warning",
            text: "Se seu investimento rende 8% ao ano e a inflação é 5%, seu ganho REAL é de apenas 3%. Sempre desconte a inflação!"
          }
        },
        {
          title: "Taxa Selic",
          content: "A Selic é a taxa básica de juros da economia brasileira, definida pelo Copom (Banco Central) a cada 45 dias. Ela influencia todas as outras taxas de juros do país.",
          bullets: [
            "Selic alta: renda fixa rende mais, crédito mais caro, economia desacelera",
            "Selic baixa: renda fixa rende menos, crédito mais barato, economia acelera",
            "Renda fixa: acompanha a Selic de perto",
            "Ações: tendem a subir quando Selic cai (dinheiro migra para bolsa)"
          ]
        },
        {
          title: "Taxa de Câmbio (Dólar)",
          content: "A cotação do dólar afeta importações, exportações e inflação. Empresas exportadoras se beneficiam do dólar alto; importadoras, do dólar baixo.",
          bullets: [
            "Dólar alto: beneficia exportadores, encarece importados",
            "Dólar baixo: beneficia importadores, barateia viagens internacionais",
            "Investir em dólar pode ser uma proteção (hedge) para sua carteira"
          ]
        },
        {
          title: "Taxa de Desemprego",
          content: "Mostra a porcentagem da força de trabalho que está desempregada e buscando emprego. Desemprego alto indica economia fraca; desemprego baixo pode gerar pressão inflacionária."
        }
      ],
      keyLearnings: [
        "PIB mede o tamanho e crescimento da economia",
        "Inflação corrói seu poder de compra - seus investimentos devem superá-la",
        "Taxa Selic influencia todos os investimentos do país",
        "Dólar alto beneficia exportadores, baixo beneficia importadores",
        "Acompanhe indicadores para antecipar movimentos do mercado"
      ],
      nextSteps: "Agora você entende o cenário econômico! Para proteger seu patrimônio, faça o curso \"Gestão de Risco e Proteção Patrimonial\"."
    }
  },
  {
    id: "10",
    slug: "gestao-risco-protecao",
    title: "Gestão de Risco e Proteção Patrimonial",
    description: "Técnicas para proteger seu patrimônio, gerenciar riscos e tomar decisões mais seguras no mercado.",
    icon: "🛡️",
    durationMinutes: 20,
    level: "Intermediário",
    content: {
      introduction: "Ganhar dinheiro investindo é importante, mas proteger o que você já conquistou é ainda mais crucial. Gestão de risco é a arte de preservar seu patrimônio em qualquer cenário de mercado.",
      sections: [
        {
          title: "Tipos de Risco nos Investimentos",
          content: "Todo investimento envolve algum tipo de risco. Conhecer os diferentes tipos ajuda a se proteger melhor.",
          bullets: [
            "Risco de mercado: variações de preços por fatores econômicos",
            "Risco de crédito: o emissor não honrar o pagamento",
            "Risco de liquidez: dificuldade de vender o ativo rapidamente",
            "Risco cambial: variações nas taxas de câmbio",
            "Risco sistêmico: colapso de todo o sistema financeiro"
          ]
        },
        {
          title: "Estratégias de Proteção",
          content: "Existem diversas formas de proteger sua carteira contra perdas significativas.",
          bullets: [
            "Diversificação: nunca coloque todos os ovos na mesma cesta",
            "Reserva de emergência: mantenha 6-12 meses de despesas em liquidez",
            "Stop loss: defina limites de perda aceitáveis antes de investir",
            "Hedge: use ativos que sobem quando outros caem (ouro, dólar)"
          ],
          tip: {
            type: "tip",
            text: "Uma regra simples: nunca invista mais de 5% do seu patrimônio em um único ativo de alto risco. Isso limita perdas em caso de problemas."
          }
        },
        {
          title: "O Poder da Reserva de Emergência",
          content: "A reserva de emergência é sua primeira linha de defesa. Sem ela, você pode ser forçado a vender investimentos em momentos ruins ou contrair dívidas com juros altos.",
          bullets: [
            "Valor: 6 a 12 meses de gastos mensais",
            "Onde guardar: Tesouro Selic, CDB de liquidez diária",
            "Características: seguro, líquido, fácil acesso"
          ],
          tip: {
            type: "warning",
            text: "NÃO INVISTA em renda variável antes de ter sua reserva de emergência completa. Isso não é negociável."
          }
        },
        {
          title: "Proteção Contra Inflação",
          content: "A inflação é um risco silencioso que corrói seu patrimônio ao longo do tempo. Investimentos que não acompanham a inflação fazem você perder poder de compra.",
          bullets: [
            "Tesouro IPCA+: garante rendimento real acima da inflação",
            "Fundos Imobiliários: aluguéis geralmente são reajustados pela inflação",
            "Ações de setores defensivos: utilities, alimentos básicos",
            "Dólar e ouro: proteção em momentos de crise"
          ]
        },
        {
          title: "Seguros e Proteção Familiar",
          content: "Além dos investimentos, é importante proteger seu patrimônio e sua família com seguros adequados.",
          bullets: [
            "Seguro de vida: proteção financeira para dependentes",
            "Previdência privada: complemento à aposentadoria do INSS",
            "Seguro residencial: proteção contra imprevistos no lar",
            "Plano de saúde: evita gastos inesperados com saúde"
          ]
        }
      ],
      keyLearnings: [
        "Existem diferentes tipos de risco: mercado, crédito, liquidez, câmbio",
        "Diversificação é a principal estratégia de proteção",
        "Reserva de emergência é obrigatória antes de investir em risco",
        "Hedge com ouro e dólar protege em momentos de crise",
        "Seguros complementam a proteção do seu patrimônio"
      ],
      nextSteps: "Parabéns! Você completou todos os cursos da Academia Lupa Financeira. Agora você tem uma base sólida para tomar decisões financeiras mais inteligentes. Continue acompanhando nossas notícias e relatórios para se manter atualizado!"
    }
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return coursesData.find(course => course.slug === slug);
};

export const getCourseLevelColor = (level: string) => {
  switch (level) {
    case "Iniciante":
      return "bg-accent/10 text-accent border-accent/20";
    case "Intermediário":
      return "bg-primary/10 text-primary border-primary/20";
    case "Avançado":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};
