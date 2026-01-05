import { GoogleGenAI, Type } from "@google/genai";
import { DepartmentRecommendation, DEPARTMENTS } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-3-flash-preview";

export const analyzeSymptoms = async (symptoms: string): Promise<DepartmentRecommendation> => {
  const deptListString = DEPARTMENTS.map(d => `${d.name} (${d.code})`).join(", ");

  const prompt = `
    Bạn là một trợ lý y tế AI chuyên nghiệp (AI Triage).
    Nhiệm vụ của bạn là phân tích các triệu chứng sau đây của bệnh nhân và gợi ý chuyên khoa phù hợp nhất từ danh sách này: [${deptListString}].
    
    Triệu chứng bệnh nhân: "${symptoms}"

    Hãy suy luận logic dựa trên y khoa. Nếu triệu chứng không rõ ràng, hãy chọn 'NOI_KHOA' (Nội khoa).
    Độ tin cậy (confidence) thang điểm 0-100.
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
            deptName: { type: Type.STRING, description: "Tên hiển thị của khoa" },
            reasoning: { type: Type.STRING, description: "Giải thích ngắn gọn lý do chọn khoa này cho bệnh nhân (tiếng Việt)" },
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
      deptName: "Nội Khoa Tổng Quát",
      reasoning: "Hệ thống AI đang bận, chuyển về nội khoa để sàng lọc.",
      confidence: 0
    };
  }
};