import { db } from '~/server/db';
import { notes } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const method = getMethod(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Note ID is required'
    });
  }

  // GET /api/notes/:id - Get a note by ID
  if (method === 'GET') {
    try {
      const note = await db.select().from(notes).where(eq(notes.id, id)).get();
      
      if (!note) {
        throw createError({
          statusCode: 404,
          message: `Note with ID ${id} not found`
        });
      }
      
      return note;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch note'
      });
    }
  }

  // PUT /api/notes/:id - Update a note
  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      
      if (!body.title || !body.content) {
        throw createError({
          statusCode: 400,
          message: 'Title and content are required'
        });
      }
      
      const now = new Date();
      const updatedNote = {
        title: body.title,
        content: body.content,
        updatedAt: now
      };
      
      await db.update(notes)
        .set(updatedNote)
        .where(eq(notes.id, id));
      
      return { id, ...updatedNote };
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      throw createError({
        statusCode: 500,
        message: 'Failed to update note'
      });
    }
  }

  // DELETE /api/notes/:id - Delete a note
  if (method === 'DELETE') {
    try {
      await db.delete(notes).where(eq(notes.id, id));
      return { id, deleted: true };
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      throw createError({
        statusCode: 500,
        message: 'Failed to delete note'
      });
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  });
});
