import { getUserById } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }
  
  const user = await getUserById(id)
  
  if (!user) {
    throw createError({
      statusCode: 404,
      message: `User with ID ${id} not found`
    })
  }
  
  return user
})
