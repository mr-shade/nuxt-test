<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-blue-600">Nuxt Fullstack App</NuxtLink>
        <div class="space-x-4">
          <NuxtLink to="/" class="text-gray-700 hover:text-blue-600">Home</NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-blue-600">About</NuxtLink>
          <NuxtLink to="/users" class="text-gray-700 hover:text-blue-600">Users</NuxtLink>
          <NuxtLink to="/notes" class="text-gray-700 hover:text-blue-600">Notes</NuxtLink>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-white shadow-inner py-6">
      <div class="container mx-auto px-4 text-center text-gray-500">
        &copy; {{ new Date().getFullYear() }} Nuxt Fullstack App
      </div>
    </footer>
  </div>
</template>
