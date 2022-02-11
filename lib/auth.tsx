import { useEffect, useState } from "react"
import client from "./client"

export const authenticatedFetcher = (url: string) =>
    client
        .get(url, {
            headers: {
                "Authorization": `Bearer ${getSession()?.accessToken}`,
            }
        })
        .then(res => res.data)

export type Session = {
    id: string;
    userId: number;
    accessToken: string;
    // unix time (seconds)
    expiresAt: number;
}

// Represents session info without authorization token.
// Used in session list.
export type SessionMeta = {
    id: string;
    ip: string;
    userAgent: string;
    lastAccessedAt: number;
}

let session: Session | null = null

export const useSession = () => {
    // todo
    const [session, setSession] = useState<Session | null>()
    useEffect(() => setSession(getSession()), [])
    return session
}

export function getSession(): Session | null {
    if (session != null) {
        return session
    } else {
        return session = getSessionFromStorage()
    }
}

function getSessionFromStorage(): Session | null {
    const sessionJson = localStorage.getItem("session")
    if (sessionJson != null) {
        const session = JSON.parse(sessionJson) as Session
        // invalidate session if expired
        const currentUnixSeconds = Date.now() / 1000
        if (currentUnixSeconds >= session.expiresAt) {
            removeSessionFromStorage()
            return null
        } else {
            return session
        }
    } else {
        return null
    }
}

export function setCurrentSession(newSession: Session) {
    localStorage.setItem("session", JSON.stringify(newSession))
    session = newSession
}

function removeSessionFromStorage() {
    localStorage.removeItem("session")
}

export async function getAuthUrl(): Promise<string> {
    type AuthUrlResponse = {
        url: string
    }
    const r = await client.get<AuthUrlResponse>("/auth/discord")
    return r.data.url
}

export const login = (code: string) => client
    .post<Session>("/auth/discord", {
        "code": code,
    })
    .then(response => response.data)

export async function logout(): Promise<void> {
    const currSession = getSession()
    if (currSession) {
        const invalidateLocalSession = () => {
            removeSessionFromStorage()
            session = null
        }

        return client
            .post("/auth/logout", null, {
                headers: {
                    "Authorization": `Bearer ${currSession.accessToken}`,
                }
            })
            .then(invalidateLocalSession)
            .catch(ex => {
                if (ex.response?.status == 401) {
                    invalidateLocalSession()
                } else {
                    throw ex;
                }
            })
    } else {
        return;
    }
}
