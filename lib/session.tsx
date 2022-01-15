import client from "./client"

export type Session = {
    userId: number;
    accessToken: string;
    expiresAt: number;
}

export function getSession(): Session | null {
    const sessionJson = localStorage.getItem("session")
    if (sessionJson != null) {
        return JSON.parse(sessionJson)
    } else {
        return null
    }
}

export function setSession(session: Session) {
    localStorage.setItem("session", JSON.stringify(session))
}

export function removeSession() {
    localStorage.removeItem("session")
}

export function getAuthUrl(): Promise<string> {
    type AuthUrlResponse = {
        url: string
    }
    console.log('test123312123')
    return client
        .get<AuthUrlResponse>("/auth/discord")
        .then(r => r.data.url)
}
