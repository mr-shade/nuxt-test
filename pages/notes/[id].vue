<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/notes" class="text-blue-600 hover:underline flex items-center">
        <span class="mr-1">←</span>
        Back to Notes
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold mb-6">Edit Note</h1>

    <div v-if="pending" class="text-center py-4">
      <svg class="animate-spin h-6 w-6 mx-auto text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-500">Loading note...</p>
    </div>

    <div v-else-if="error || !note" class="bg-red-50 p-4 rounded-md text-red-700">
      <p>Error loading note. Note might not exist.</p>
      <NuxtLink to="/notes" class="text-red-700 font-medium hover:underline mt-2 inline-block">
        Return to notes list
      </NuxtLink>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="updateNote">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            v-model="editedNote.title"
            type="text"
            placeholder="Enter note title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            v-model="editedNote.content"
            placeholder="Enter note content"
            rows="8"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div class="flex justify-between">
          <button
            type="button"
            @click="router.push('/notes')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isUpdating"
          >
            {{ isUpdating ? 'Updating...' : 'Update Note' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

// Fetch the note
const { data: note, pending, error } = await useFetch(`/api/notes/${id}`);

// Create a copy for editing
const editedNote = ref({
  title: '',
  content: ''
});

// Update when note data is loaded
watch(note, (newNote) => {
  if (newNote) {
    editedNote.value.title = newNote.title;
    editedNote.value.content = newNote.content;
  }
}, { immediate: true });

// State for update operation
const isUpdating = ref(false);

// Update the note
async function updateNote() {
  if (!editedNote.value.title || !editedNote.value.content) {
    return;
  }

  isUpdating.value = true;

  try {
    await $fetch(`/api/notes/${id}`, {
      method: 'PUT',
      body: editedNote.value
    });

    alert('Note updated successfully');

    // Navigate back to notes list
    router.push('/notes');
  } catch (error) {
    console.error('Error updating note:', error);
    alert('Failed to update note');
  } finally {
    isUpdating.value = false;
  }
}
</script>
