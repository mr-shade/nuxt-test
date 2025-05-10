<script setup>
const route = useRoute()
const { id } = route.params

const { data: user, pending, error } = await useFetch(`/api/users/${id}`)
</script>

<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/users" class="text-blue-600 hover:underline flex items-center">
        <UIcon name="i-heroicons-arrow-left" class="mr-1" />
        Back to Users
      </NuxtLink>
    </div>
    
    <div v-if="pending" class="text-center py-4">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto text-gray-500" />
      <p class="mt-2 text-gray-500">Loading user details...</p>
    </div>
    
    <div v-else-if="error || !user" class="bg-red-50 p-4 rounded-md text-red-700">
      <p>Error loading user details. User might not exist.</p>
      <NuxtLink to="/users" class="text-red-700 font-medium hover:underline mt-2 inline-block">
        Return to users list
      </NuxtLink>
    </div>
    
    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center space-x-4 mb-6">
        <UAvatar :alt="user.name" size="xl" />
        <div>
          <h1 class="text-2xl font-bold">{{ user.name }}</h1>
          <p class="text-gray-600">{{ user.email }}</p>
          <UBadge :color="user.role === 'admin' ? 'red' : user.role === 'editor' ? 'amber' : 'blue'" class="mt-2">
            {{ user.role }}
          </UBadge>
        </div>
      </div>
      
      <div class="border-t pt-4">
        <h2 class="text-lg font-semibold mb-2">User Details</h2>
        <p class="text-gray-600">User ID: {{ user.id }}</p>
        <p class="text-gray-600">Created: {{ new Date(user.createdAt).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>
