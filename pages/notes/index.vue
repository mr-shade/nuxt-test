<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Notes</h1>

    <!-- Create Note Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Create New Note</h2>
      <form @submit.prevent="createNote">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            v-model="newNote.title"
            type="text"
            placeholder="Enter note title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            v-model="newNote.content"
            placeholder="Enter note content"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isCreating"
          >
            {{ isCreating ? 'Creating...' : 'Create Note' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Notes List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Your Notes</h2>
        <button
          @click="refreshNotes"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="isPending"
        >
          {{ isPending ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="isPending" class="text-center py-4">
        <svg class="animate-spin h-6 w-6 mx-auto text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-500">Loading notes...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700">
        <p>Error loading notes. Please try again.</p>
      </div>

      <div v-else-if="notes && notes.length === 0" class="text-center py-4 text-gray-500">
        <p>No notes found. Create your first note above.</p>
      </div>

      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li v-for="note in notes" :key="note.id" class="py-4">
            <div class="flex justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ note.title }}</h3>
                <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ note.content }}</p>
                <p class="mt-1 text-xs text-gray-500">
                  Last updated: {{ new Date(note.updatedAt).toLocaleString() }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="navigateToEdit(note.id)"
                  class="inline-flex items-center p-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(note)"
                  class="inline-flex items-center p-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Note</h3>
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete "{{ noteToDelete?.title }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="isDeleteModalOpen = false"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            @click="deleteNote"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/server/db/schema';

// State for new note form
const newNote = ref({
  title: '',
  content: ''
});

// State for notes list
const { data: notes, pending: isPending, error, refresh: refreshNotes } = await useFetch('/api/notes');

// State for create operation
const isCreating = ref(false);

// State for delete operation
const isDeleting = ref(false);
const isDeleteModalOpen = ref(false);
const noteToDelete = ref<Note | null>(null);

const router = useRouter();

// Create a new note
async function createNote() {
  if (!newNote.value.title || !newNote.value.content) {
    return;
  }

  isCreating.value = true;

  try {
    await $fetch('/api/notes', {
      method: 'POST',
      body: newNote.value
    });

    // Reset form
    newNote.value.title = '';
    newNote.value.content = '';

    // Refresh notes list
    refreshNotes();

    alert('Note created successfully');
  } catch (error) {
    console.error('Error creating note:', error);
    alert('Failed to create note');
  } finally {
    isCreating.value = false;
  }
}

// Navigate to edit page
function navigateToEdit(id: string) {
  router.push(`/notes/${id}`);
}

// Confirm delete
function confirmDelete(note: Note) {
  noteToDelete.value = note;
  isDeleteModalOpen.value = true;
}

// Delete a note
async function deleteNote() {
  if (!noteToDelete.value) return;

  isDeleting.value = true;

  try {
    await $fetch(`/api/notes/${noteToDelete.value.id}`, {
      method: 'DELETE'
    });

    // Refresh notes list
    refreshNotes();

    // Close modal
    isDeleteModalOpen.value = false;
    noteToDelete.value = null;

    alert('Note deleted successfully');
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Failed to delete note');
  } finally {
    isDeleting.value = false;
  }
}
</script>
