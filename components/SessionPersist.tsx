'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SessionPersist() {
  const pathname = usePathname()

  useEffect(() => {
    const prodCookieName = '__Secure-authjs.session-token'
    const devCookieName = 'authjs.session-token'
    const isProd = window.location.protocol === 'https:'
    const cookieName = isProd ? prodCookieName : devCookieName
    const storageKey = isProd ? 'cached_prod_session_token' : 'cached_dev_session_token'

    // Helper to get cookie value by name
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    // Helper to set cookie
    const setCookie = (name: string, value: string, days: number) => {
      let expires = ""
      if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
      }
      document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax${isProd ? '; Secure' : ''}`
    }

    const currentCookie = getCookie(cookieName)
    const isLoginPage = pathname?.startsWith('/auth/login')

    if (isLoginPage) {
      // If we are on the login page:
      // We check if we already attempted to restore the session in this window session
      const restoreAttempted = sessionStorage.getItem('restore_attempted')

      if (!restoreAttempted) {
        // If we haven't attempted to restore yet (e.g. app just loaded and redirected here),
        // we check if we have a stashed token in localStorage.
        const cachedToken = localStorage.getItem(storageKey)
        if (cachedToken) {
          // Mark restore as attempted in sessionStorage
          sessionStorage.setItem('restore_attempted', 'true')
          // Restore the cookie
          setCookie(cookieName, cachedToken, 30) // 30 days
          
          // Reload to let NextAuth recognize the restored cookie
          window.location.reload()
          return
        }
      } else {
        // If we already attempted to restore and still ended up on login, or if this is an explicit logout,
        // we clear the cache so the user can log in with a clean state.
        localStorage.removeItem(storageKey)
        sessionStorage.removeItem('restore_attempted')
      }
    } else {
      // If we are on any page other than login (meaning user is logged in):
      if (currentCookie) {
        // Cookie exists, stash/update it in localStorage
        localStorage.setItem(storageKey, currentCookie)
        // Mark restore as attempted/valid since we are active
        sessionStorage.setItem('restore_attempted', 'true')
      }
    }
  }, [pathname])

  return null
}
