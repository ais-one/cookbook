// handlers.js
import { rest } from 'msw'

// This handler will intercept any rest request in your project.
export const handlers = [
  rest.get('https://https://jsonplaceholder.typicode.com/todos/1', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false
      })
    )
  })
]
