import { redirect } from "next/navigation"
import { auth } from "./auth"
import { prisma } from "./db"

interface User {
  name: string
  image: string
  email: string
  id: string
  userType:string
}

// Overloads
export async function getCurrentUser(): Promise<User>
export async function getCurrentUser(options: { redirectOnFail: false }): Promise<User | null>
export async function getCurrentUser(options?: { redirectOnFail?: boolean }): Promise<User | null> {
  const redirectOnFail = options?.redirectOnFail ?? true
  const session = await auth()

  if (!session) {
    if (redirectOnFail) {
      redirect("/login")
    }
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  if (!user) {
    if (redirectOnFail) {
      redirect("/login")
    }
    return null
  }

  return user
}
