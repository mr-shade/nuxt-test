<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Welcome to Nuxt Fullstack App</h1>
    <p class="mb-4">This is a sample fullstack application built with Nuxt.js.</p>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Features</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li>Server-side rendering</li>
        <li>API routes</li>
        <li>Database integration with Turso and Drizzle ORM</li>
        <li>Responsive UI with Nuxt UI</li>
        <li><NuxtLink to="/notes" class="text-blue-600 hover:underline">Notes Application</NuxtLink> - Try our new notes app!</li>
      </ul>
    </div>
  </div>
</template>
