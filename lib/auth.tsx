import client from "./client"

export type Session = {
    userId: number;
    accessToken: string;
    // unix time (seconds)
    expiresAt: number;
}

let session: Session | null = null

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

export function getAuthUrl(): Promise<string> {
    type AuthUrlResponse = {
        url: string
    }
    return client
        .get<AuthUrlResponse>("/auth/discord")
        .then(r => r.data.url)
}

export const login = (code: string) => client
    .post<Session>("/auth/discord", {
        "code": code,
    })
    .then(response => response.data)

export async function logout(): Promise<void> {
    const currSession = getSession()
    if (currSession) {
        client
            .post("/auth/logout", null, {
                headers: {
                    "Authorization": `Bearer ${currSession.accessToken}`,
                }
            })
            .then(r => {
                removeSessionFromStorage()
                session = null
            })
    }
}
