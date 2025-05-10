import { promises as fs } from 'fs'
import { resolve } from 'path'

const dbPath = resolve('./server/data/users.json')

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
  createdAt: string
}

export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users data:', error)
    return []
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await getUsers()
    return users.find(user => user.id === id) || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    const users = await getUsers()
    
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString()
    }
    
    const updatedUsers = [...users, newUser]
    await fs.writeFile(dbPath, JSON.stringify(updatedUsers, null, 2))
    
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
