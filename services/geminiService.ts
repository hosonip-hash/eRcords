import { GoogleGenAI, Type } from "@google/genai";
import { DepartmentRecommendation, DEPARTMENTS, Language } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-3-flash-preview";

export const analyzeSymptoms = async (symptoms: string, lang: Language): Promise<DepartmentRecommendation> => {
  const deptListString = DEPARTMENTS.map(d => `${d.name} (${d.code})`).join(", ");
  const langInstruction = lang === 'vi' ? 'Tiếng Việt' : 'English';

  const prompt = `
    Bạn là một trợ lý y tế AI chuyên nghiệp (AI Triage).
    Nhiệm vụ của bạn là phân tích các triệu chứng sau đây của bệnh nhân và gợi ý chuyên khoa phù hợp nhất từ danh sách này: [${deptListString}].
    
    Triệu chứng bệnh nhân: "${symptoms}"

    Hãy suy luận logic dựa trên y khoa. Nếu triệu chứng không rõ ràng, hãy chọn 'NOI_KHOA' (Nội khoa).
    Độ tin cậy (confidence) thang điểm 0-100.

    QUAN TRỌNG:
    - Trả lời bằng ngôn ngữ: ${langInstruction}.
    - Nếu là tiếng Anh, hãy dịch tên khoa (deptName) sang tiếng Anh.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deptCode: { type: Type.STRING, description: "Mã khoa khám bệnh (VD: NOI_KHOA)" },
            deptName: { type: Type.STRING, description: "Tên hiển thị của khoa (Translated to target language)" },
            reasoning: { type: Type.STRING, description: "Giải thích ngắn gọn lý do chọn khoa này cho bệnh nhân (Translated to target language)" },
            confidence: { type: Type.NUMBER, description: "Độ tự tin của dự đoán (0-100)" },
          },
          required: ["deptCode", "deptName", "reasoning", "confidence"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    return JSON.parse(text) as DepartmentRecommendation;
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    // Fallback in case of AI error
    return {
      deptCode: "NOI_KHOA",
      deptName: lang === 'vi' ? "Nội Khoa Tổng Quát" : "General Internal Medicine",
      reasoning: lang === 'vi' ? "Hệ thống AI đang bận, chuyển về nội khoa để sàng lọc." : "AI System busy, defaulting to General Internal Medicine.",
      confidence: 0
    };
  }
};