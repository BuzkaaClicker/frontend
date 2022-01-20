import client from "./client"

export type Profile = {
    name: string
    avatarUrl: string
}

export async function getProfileByUserId(userId: number): Promise<Profile | null> {
    return client
        .get<Profile>("/profile/" + userId)
        .then(response => response.data)
}
