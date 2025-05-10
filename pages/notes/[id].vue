<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/notes" class="text-blue-600 hover:underline flex items-center">
        <UIcon name="i-heroicons-arrow-left" class="mr-1" />
        Back to Notes
      </NuxtLink>
    </div>
    
    <h1 class="text-3xl font-bold mb-6">Edit Note</h1>
    
    <div v-if="pending" class="text-center py-4">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto text-gray-500" />
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
          <UFormGroup label="Title" name="title">
            <UInput v-model="editedNote.title" placeholder="Enter note title" />
          </UFormGroup>
        </div>
        <div class="mb-4">
          <UFormGroup label="Content" name="content">
            <UTextarea v-model="editedNote.content" placeholder="Enter note content" rows="8" />
          </UFormGroup>
        </div>
        <div class="flex justify-between">
          <UButton color="gray" @click="router.push('/notes')">Cancel</UButton>
          <UButton type="submit" color="blue" :loading="isUpdating">
            Update Note
          </UButton>
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
    
    // Show success toast
    useToast().add({
      title: 'Success',
      description: 'Note updated successfully',
      color: 'green'
    });
    
    // Navigate back to notes list
    router.push('/notes');
  } catch (error) {
    console.error('Error updating note:', error);
    useToast().add({
      title: 'Error',
      description: 'Failed to update note',
      color: 'red'
    });
  } finally {
    isUpdating.value = false;
  }
}
</script>
