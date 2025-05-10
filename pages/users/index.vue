<script setup>
const { data: users, pending, error, refresh } = await useFetch('/api/users')

const newUser = ref({
  name: '',
  email: '',
  role: 'user'
})

const isSubmitting = ref(false)

async function addUser() {
  if (!newUser.value.name || !newUser.value.email) return

  isSubmitting.value = true
  
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: newUser.value
    })
    
    // Reset form
    newUser.value = {
      name: '',
      email: '',
      role: 'user'
    }
    
    // Refresh users list
    refresh()
  } catch (err) {
    console.error('Error adding user:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Users</h1>
    
    <!-- Add User Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New User</h2>
      <form @submit.prevent="addUser" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input 
            id="name" 
            v-model="newUser.name" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            v-model="newUser.email" 
            type="email" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <select 
            id="role" 
            v-model="newUser.role" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        
        <div>
          <UButton 
            type="submit" 
            :loading="isSubmitting"
            :disabled="isSubmitting || !newUser.name || !newUser.email"
          >
            Add User
          </UButton>
        </div>
      </form>
    </div>
    
    <!-- Users List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">User List</h2>
      
      <div v-if="pending" class="text-center py-4">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto text-gray-500" />
        <p class="mt-2 text-gray-500">Loading users...</p>
      </div>
      
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-700">
        <p>Error loading users. Please try again.</p>
      </div>
      
      <div v-else-if="users && users.length === 0" class="text-center py-4 text-gray-500">
        <p>No users found. Add your first user above.</p>
      </div>
      
      <div v-else>
        <ul class="divide-y divide-gray-200">
          <li v-for="user in users" :key="user.id" class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <UAvatar :alt="user.name" size="md" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
              </div>
              <div>
                <UBadge :color="user.role === 'admin' ? 'red' : user.role === 'editor' ? 'amber' : 'blue'">
                  {{ user.role }}
                </UBadge>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
