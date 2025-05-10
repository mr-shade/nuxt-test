import { db } from '~/server/db';
import { notes } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  // GET /api/notes - Get all notes
  if (method === 'GET') {
    try {
      const allNotes = await db.select().from(notes).orderBy(notes.updatedAt);
      return allNotes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch notes'
      });
    }
  }

  // POST /api/notes - Create a new note
  if (method === 'POST') {
    try {
      const body = await readBody(event);

      if (!body.title || !body.content) {
        throw createError({
          statusCode: 400,
          message: 'Title and content are required'
        });
      }

      const now = new Date();
      const newNote = {
        id: randomUUID(),
        title: body.title,
        content: body.content,
        createdAt: now,
        updatedAt: now
      };

      await db.insert(notes).values(newNote);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw createError({
        statusCode: 500,
        message: 'Failed to create note'
      });
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  });
});
