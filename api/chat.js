export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages é obrigatório' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Você é um assistente de estudos inteligente, paciente e amigável, que responde sempre em português brasileiro.
Ajude o aluno a entender conceitos, resolver dúvidas, criar resumos e praticar exercícios.
IMPORTANTE: Suas respostas serão lidas em voz alta, então escreva de forma natural e conversacional, como se estivesse explicando pessoalmente. Evite listas com bullets ou símbolos — prefira frases e parágrafos fluidos. Seja conciso mas completo. Use no máximo 3 parágrafos curtos.`,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Erro na API' });
    }

    return res.status(200).json({ reply: data.content?.[0]?.text || '' });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}