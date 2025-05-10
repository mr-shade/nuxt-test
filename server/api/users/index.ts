import { getUsers, createUser } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  // GET /api/users - Get all users
  if (method === 'GET') {
    return await getUsers()
  }
  
  // POST /api/users - Create a new user
  if (method === 'POST') {
    const body = await readBody(event)
    
    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        message: 'Name and email are required'
      })
    }
    
    return await createUser({
      name: body.name,
      email: body.email,
      role: body.role || 'user'
    })
  }
  
  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
