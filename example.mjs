import OpenAI from "openai";
const openai = new OpenAI({ apiKey: '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' });

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
});

console.log(completion.choices[0].message);