<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Notes</h1>

    <!-- Create Note Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Create New Note</h2>
      <form @submit.prevent="createNote">
        <div class="mb-4">
          <UFormGroup label="Title" name="title">
            <UInput v-model="newNote.title" placeholder="Enter note title" />
          </UFormGroup>
        </div>
        <div class="mb-4">
          <UFormGroup label="Content" name="content">
            <UTextarea v-model="newNote.content" placeholder="Enter note content" rows="4" />
          </UFormGroup>
        </div>
        <div class="flex justify-end">
          <UButton type="submit" color="blue" :loading="isCreating">
            Create Note
          </UButton>
        </div>
      </form>
    </div>

    <!-- Notes List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Your Notes</h2>
        <UButton color="gray" @click="refreshNotes" :loading="isPending" icon="i-heroicons-arrow-path" />
      </div>

      <div v-if="isPending" class="text-center py-4">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto text-gray-500" />
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
                <UButton color="gray" icon="i-heroicons-pencil-square" size="sm"
                  @click="navigateToEdit(note.id)" />
                <UButton color="red" icon="i-heroicons-trash" size="sm"
                  @click="confirmDelete(note)" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="isDeleteModalOpen">
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Note</h3>
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete "{{ noteToDelete?.title }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-2">
          <UButton color="gray" @click="isDeleteModalOpen = false">Cancel</UButton>
          <UButton color="red" @click="deleteNote" :loading="isDeleting">Delete</UButton>
        </div>
      </div>
    </UModal>
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

    // Show success toast
    useToast().add({
      title: 'Success',
      description: 'Note created successfully',
      color: 'green'
    });
  } catch (error) {
    console.error('Error creating note:', error);
    useToast().add({
      title: 'Error',
      description: 'Failed to create note',
      color: 'red'
    });
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

    // Show success toast
    useToast().add({
      title: 'Success',
      description: 'Note deleted successfully',
      color: 'green'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    useToast().add({
      title: 'Error',
      description: 'Failed to delete note',
      color: 'red'
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>
