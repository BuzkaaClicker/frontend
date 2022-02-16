import { NextPage } from "next"
import { Link, Progress, Text, VStack } from '@chakra-ui/react'
import Head from "next/head"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"
import { getAuthUrl, getSession, login, Session, setCurrentSession } from "../../lib/auth"
import { FullScreenDialog } from "../../components/dialog"

// login flow:
// 1. naviagte to /auth/discord
// 2. navigate to discord oauth page (from "/api/auth/discord" url)
// 3. discord oauth redirects back to "/auth/discord" but with "code" param
// 4. try register/login by sending discord access "code" to the /api/auth/discord via post json
// 5. handle response (2xx status - succes -> redirect to home page after 2 seconds of login success message) 

type State =
    | { type: "dismounted" }
    | { type: "generating_url" }
    | { type: "authorizing" }
    | { type: "auth_success", session: Session }
    | { type: "failure", error: any }

const DiscordAuth: NextPage = () => {
    const [state, setState] = useState<State>({ type: "dismounted" })
    const { query, isReady } = useRouter()

    const redirectToOAuth = () => {
        setState({ type: "generating_url" })
        getAuthUrl()
            .then(url => window.location.href = url)
            .catch(err => setState({ type: "failure", error: err }))
    }

    const authorize = (code: string) => {
        setState({ type: "authorizing" })
        login(code)
            .then(session => {
                setCurrentSession(session)
                setState({ type: "auth_success", session: session })
                setTimeout(() => window.location.href = "/", 2000)
            })
            .catch(err => setState({ type: "failure", error: err }))
    }

    useEffect(() => {
        let session = getSession()
        if (session) { // if already authenticated
            window.location.href = "/" // redirect to home page
        } else if (isReady && state.type == "dismounted") { // if router is ready && page is in right state
            const code = query["code"]?.toString()
            if (code == null || code == "") {
                const discordError = query["error"]?.toString()
                if (discordError == null || discordError == "") {
                    redirectToOAuth()
                } else {
                    setState({ type: "failure", error: { type: "discord_error", code: discordError } })
                }
            } else {
                authorize(code)
            }
        }
    }, [isReady])

    return (
        <>
            <Head>
                <title>Autoryzacja - BuzkaaClicker.pl</title>
            </Head>

            <main>
                <FullScreenDialog title="Logowanie">
                    {render(state, redirectToOAuth)}
                </FullScreenDialog>
            </main>
        </>
    )
}

function render(state: State, onReload: () => void): ReactElement {
    switch (state.type) {
        case "generating_url":
            return <>
                <Text>Uzyskiwanie łącza do autoryzacji...</Text>
                <Progress width="2rem" height="0.2rem" isIndeterminate />
            </>
        case "authorizing":
            return <>
                <Text>Trwa autoryzacja...</Text>
                <Progress width="2rem" height="0.2rem" isIndeterminate />
            </>
        case "auth_success":
            return <Text>Zalogowano pomyślnie</Text>
        case "failure":
            return <AuthError err={state.error} onRetry={onReload} />
        default:
            return <Text>Wczytywanie...</Text>
    }
}

const AuthError = ({ err, onRetry }: { err: any, onRetry: () => void }) => {
    const retryLink = <Link onClick={onRetry}>Czy chcesz spróbować jeszcze raz?</Link>

    if (err.response) {
        const translated = (() => {
            switch (err.response.data.error_message) {
                case "invalid code": return "Nieprawidłowy kod"
                case "missing email": return "Nie uzyskano dostępu do e-mail. " +
                    "Przypisz e-mail do konta discord, zweryfikuj go i spróbuj ponownie."
                case "discord guild join unauthorized": return "Brak dostępu do dołączenia do serwera discord! " +
                    "Jest to wymagane dlatego, że jest to nasz preferowany środek komunikacji z klientami."
                default: return err.response.data.error_message
            }
        })()
        return (
            <VStack>
                <Text>{translated}</Text>
                {retryLink}
            </VStack>
        )
    } else if (err.type == "discord_error") {
        const translated = (() => {
            switch (err.code) {
                case "access_denied": return "Odrzuciłeś/aś autoryzację konta discord."
            }
        })()
        if (translated == null) {
            console.log("Unknown discord error: " + err.code + ` (${JSON.stringify(err)})`)
        }
        return (
            <VStack>
                <Text>{translated || "Wystąpił nieznany błąd podczas autoryzacji konta discord."}</Text>
                {retryLink}
            </VStack>
        )
    } else {
        return (
            <VStack>
                <Text>Wystąpił nieznany błąd: {err?.message}</Text>
                {retryLink}
            </VStack>
        )
    }
}

export default DiscordAuth
