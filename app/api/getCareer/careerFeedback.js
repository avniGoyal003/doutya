import axios from 'axios';
import { db } from '@/utils';
import { USER_DETAILS } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { calculateAge } from '@/lib/ageCalculate';


export const maxDuration = 40; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';
// export async function GET(req)
export const careerFeedback = async (type1, type2, userId, career_name, country) => {

  const birth_date=await db
                   .select({birth_date:USER_DETAILS.birth_date})
                   .from(USER_DETAILS)
                   .where(eq(USER_DETAILS.id, userId))
  const age=calculateAge(birth_date[0].birth_date)

  const FINAL_PROMPT = `Provide a simple and concise feedback for an individual of age ${age} with a ${type1} personality type and ${type2} RIASEC interest types in the field of ${career_name}${country ? " in " + country : ""}. The feedback should highlight key areas for improvement in this career, such as time management, organizational skills, and other relevant skills. Avoid lengthy descriptions and complex formatting. Ensure the response is valid JSON and exclude the terms '${type1}' and 'RIASEC' from the data. Provide the output as a single paragraph without additional wrapping other than {}.`;


  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or 'gpt-4' if you have access
        messages: [{ role: "user", content: FINAL_PROMPT }],
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API request completed.");
    let responseText = response.data.choices[0].message.content.trim();
    responseText = responseText.replace(/```json|```/g, "").trim();
    // console.log("responseText",responseText);

    return { result: responseText };

  } catch (error) {
    console.error("Error making API request:", error);
    return { result: "An error occurred while processing your request." };
  }
}