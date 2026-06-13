"use server";

import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateBlogPost(prevState: any, formData: FormData) {
  try {
    const topic = formData.get("topic") as string;
    
    if (!topic) {
      return { success: false, message: "", error: "Topik harus diisi." };
    }

    const prompt = `Tuliskan artikel blog yang profesional dan menarik untuk bisnis cuci mobil dan detailing bernama "Emir Harmonis". 
Topik: ${topic}. 
Gunakan bahasa Indonesia yang baik, dengan format HTML (tanpa tag <html>, <body>, atau markdown backticks, cukup elemen-elemen HTML seperti <h2>, <p>, <ul>). 
Pastikan untuk menekankan layanan premium, bersih, kilap, wangi, cepat, dan ramah yang menjadi nilai jual utama Emir Harmonis.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });

    const content = response.text || "";

    if (!content) {
       return { success: false, message: "", error: "Gagal menghasilkan konten dari AI." };
    }

    // Buat judul berdasarkan topik
    const titleResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Buatkan satu judul artikel yang menarik (maksimal 60 karakter) berdasarkan topik ini: ${topic}. Hanya kembalikan teks judul saja tanpa tanda kutip.`,
    });
    const title = titleResponse.text?.trim() || `Tips: ${topic}`;

    await prisma.blogPost.create({
      data: {
        title,
        content,
      },
    });

    revalidatePath("/admin");
    return { success: true, message: "Artikel blog berhasil dibuat dan disimpan!", error: "" };
  } catch (error) {
    console.error("Error generating blog post:", error);
    return { success: false, message: "", error: "Terjadi kesalahan saat generate artikel." };
  }
}
