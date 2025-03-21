import { OpenAI } from "openai";

// Assignment instructions
const assignment_prompt = `You are a helpful AI tutoring assistant, with a specialty in the creation of educational projects and assignments. The user will prompt you with a text description of what they want or resources they have been learning. Your job is to generate a project assignment that will test what the user is learning or wants. The challenge should include the following components:
1. A description of the project, and the concepts it covers.
2. Specific requirements or constraints that the user should fulfill in their solution.
Finally, make sure to specify the programming language that the user should use to solve the challenge.`


// Challenge instructions
const instruction_prompt = `You are a helpful AI tutoring assistant, with a specialty in the creation of short educational coding challenges. The user will prompt you with either a text description of the challenge or a YouTube video caption to be the basis of the challenge that you generate. Your job is to analyze either the text given or the video linked and generate a coding challenge that will help the user practice the concepts covered in the text or video. The challenge should not have any console inputs as the user will not have access on their ide. The challenge should include the following components:
1. A description of the challenge, and the concepts it covers.
2. Specific requirements or constraints that the user should fulfill in their solution.
Finally, make sure to specify the programming language that the user should use to solve the challenge.`

// Challenge starter code/expected output
const starter_code_prompt = `You are a helpful AI tutoring assistant, with a specialty in the creation of educational coding challenges. 
The user will prompt you with a text description of a coding challenge. This description will include a brief summary of the challenge, 
the concepts it covers, and any specific requirements or constraints that the user should fulfill in their solution. Your job is to generate
starter code for the challenge, as well as an example of the expected output for a sample input. Define the sample input as a comment at the end of the output. 
The starter code should be written in the programming
language specified by the user. Make sure that the starter code isn't a complete solution to the challenge, but rather a starting point that the user
can build off of to complete the challenge. The expected output should be an example of the output that a complete solution to the challenge would produce.
Always respond to the user with a json structure and no type of extra text, such as "'''json". Here's an example of the json structure:
{
  "code": "*String containing starter code*",
  "output": "*String containing expected output*"
}`

// Chat system prompt
const chat_prompt = `You are a helpful AI tutoring assistant, with a specialty in the creation of educational coding challenges. You will 
receive a history of messages between the user and an AI assistant. The first one or two messages, however, will be system messages. The first will 
contain a description of the assignment the user is currently working on, to provide you context on how to assist the user. The second, if it is provided, will 
contain the user's code, so that you can analyze it and provide helpful feedback to the user about how to fix any problems they describe in their code. 
Your job is to analyze the conversation history, the assignment description, and, if provided, the user's code 
and generate a helpful response to the user's latest message.`

export async function fetchAIAssnResponse(type: string, inputValue: string) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key is not set in the environment variables.");
    }
    
    const openai = new OpenAI({ apiKey: openaiApiKey })
    if (type == "ASSIGNMENT") {
      const assignment_response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
              role: "system",
              content: assignment_prompt
          },
          {
              role: "user",
              content: inputValue
          }
      ],
        max_tokens: 1000,
        temperature: 0.7,
      });
      const assignment_response_data = assignment_response.choices[0].message?.content?.trim();
      if (!assignment_response_data) {
        throw new Error("AI response content is null or undefined.");
      }
  
      return {
        type: "ASSIGNMENT",
        instructions: assignment_response_data,
      };
    }
    else{

      // Generate instructions
      const instruction_response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
              role: "system",
              content: instruction_prompt
          },
          {
              role: "user",
              content: inputValue
          }
      ],
        max_tokens: 1000,
        temperature: 0.7,
      });
      const instr_data = instruction_response.choices[0].message?.content?.trim();
      if (!instr_data) {
        throw new Error("AI response content is null or undefined");
      }

      // Generate starter code if challenge
      const code_response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
              role: "system",
              content: starter_code_prompt
          },
          {
              role: "user",
              content: instr_data
          }
      ],
        max_tokens: 1000,
        temperature: 0.7,
      });
      const data = code_response.choices[0].message?.content?.trim();

      if (!data) {
        throw new Error("AI response content is null or undefined.");
      }
      const code_data = JSON.parse(data);

      return {
        type: "CHALLENGE",
        instructions: instr_data,
        starterCode: code_data.code,
        expectedOutput: code_data.output,
      };
  }
    
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return null;
  }
}

export async function fetchAIChatResponse(
  chatHistory: { id: number; historyId: number; userMessage: string; aiMessage: string; createdAt: Date; }[],
  assnInstructions: string,
  userCode: string | null, 
  userMessage: string
) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key is not set in the environment variables.");
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Format chat_messages with system messages at the beginning
    var messages: OpenAI.ChatCompletionMessageParam[]

    messages = [
      {
          role: "system",
          content: chat_prompt
      },
      {
          role: "system",
          content: assnInstructions
      }, 
    ];

    if (userCode) {
      messages = [
        ...messages,
        {
          role: "system",
          content: userCode
        }
      ]
    }

    messages = [
      ...messages,
      ...chatHistory.flatMap((chat) => [
        {
          role: "user",
          content: chat.userMessage,
        } as const,
        {
          role: "assistant",
          content: chat.aiMessage,
        } as const,
      ]),
      {
        role: "user",
        content: userMessage,
      },
    ];


    // Generate AI response
    const chat_response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = chat_response.choices[0].message?.content?.trim();
    console.log("Generated AI response:", aiResponse);

    return aiResponse;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return null;
  }
}