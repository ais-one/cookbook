import { z } from 'zod';

export default function initTools(server, initialHeaders) {
  server.registerTool(
    'echo',
    {
      title: 'Echo Tool',
      description: 'Echoes back the provided message',
      inputSchema: {
        message: z.string(),
      },
      required: ['message'],
    },
    async ({ message }) => ({
      content: [{ type: 'text', text: `Tool echo: ${message}` }],
    }),
  );

  // --- Register a "calculate-bmi" tool ---
  // The client can call this tool via "mcp/callTool" method once initialized.
  server.registerTool(
    'calculate-bmi',
    {
      title: 'BMI Calculator',
      description: 'Calculate Body Mass Index',
      inputSchema: {
        weightKg: z.number(),
        heightM: z.number(),
      },
      required: ['weightKg', 'heightM'],
    },
    async ({ weightKg, heightM }) => {
      //   // Read token from initialization time
      const authHeader = initialHeaders.authorization || null;
      if (!authHeader) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Error: missing Authorization header',
            },
          ],
        };
      }
      const bmi = weightKg / (heightM * heightM);
      // console.log('bmi done - ', bmi)
      return {
        content: [
          {
            type: 'text',
            text: `BMI for ${heightM}m and ${weightKg}kg = ${bmi.toFixed(2)}`,
            // ${authHeader.slice(0,10)}
          },
        ],
      };
    },
  );

  // --- Register a "days-to-due-date" tool ---
  server.registerTool(
    'days-to-due-date',
    {
      title: 'Get days to due date or past due',
      description: 'Calulate days to due date, negative value means past due',
      inputSchema: {
        calcDate: z.string().date(),
        dueDate: z.string().date(),
      },
      outputSchema: {
        diffDays: z.number(),
      },
      required: ['calcDate', 'dueDate'],
    },
    async ({ calcDate, dueDate }) => {
      // Create Date objects representing the two dates
      const calcDateObj = new Date(calcDate);
      const dueDateObj = new Date(dueDate);

      // Calculate the difference in milliseconds between the two dates
      const diffInMs = dueDateObj.getTime() - calcDateObj.getTime();
      const diffInDays = Math.floor(diffInMs / 86400000); // 86400000 = ms in a day (1000 * 60 * 60 * 24)

      // console.log('due date done - ', diffInDays)
      return {
        content: [
          {
            type: 'text',
            text: `Days to due date = ${diffInDays}`,
          },
        ],
        structuredContent: {
          diffDays: diffInDays,
        },
      };
    },
  );
}
