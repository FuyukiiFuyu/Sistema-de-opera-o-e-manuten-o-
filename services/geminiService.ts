import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Você é um Instrutor Sênior de Usinagem e Manutenção Industrial do SENAI (Serviço Nacional de Aprendizagem Industrial).
Seu objetivo é auxiliar alunos, docentes e técnicos da Célula 1.A.

Responda dúvidas sobre:
1. Parâmetros de corte (velocidade, avanço, RPM) para materiais comuns (Aço 1020, 1045, Alumínio, Latão).
2. Procedimentos de manutenção preventiva e corretiva em Tornos CNC, Fresadoras e Centros de Usinagem.
3. Normas de segurança (NR-12) e EPIs necessários.
4. Programação CNC (G-Code básico ISO).

Estilo de resposta:
- Técnico, porém didático e acessível.
- Use formatação clara (listas, negrito).
- Sempre priorize a segurança em suas recomendações.
- Se a pergunta não for sobre indústria/usinagem, explique educadamente que você é um assistente focado na Célula 1.A.
`;

export const askTechnicalAssistant = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "Erro: Chave de API não configurada. Por favor, verifique as configurações do sistema.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and precision for technical advice
        maxOutputTokens: 800,
      }
    });

    return response.text || "Não foi possível gerar uma resposta no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, ocorreu um erro ao consultar o assistente técnico. Tente novamente mais tarde.";
  }
};