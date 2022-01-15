import { NextPage } from "next"
import { Center, Link, Progress, Text, VStack } from '@chakra-ui/react'
import Head from "next/head"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"
import { getAuthUrl, Session, setSession } from "../../lib/session"
import api from "../../lib/client"

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
                setSession(session)
                setState({ type: "auth_success", session: session })
                setTimeout(() => window.location.href = "/", 2000)
            })
            .catch(err => setState({ type: "failure", error: err }))
    }

    useEffect(() => {
        if (!isReady || state.type != "dismounted") {
            return
        }
        const code = query["code"]?.toString()
        if (code == null || code == "") {
            redirectToOAuth()
        } else {
            authorize(code)
        }
    }, [isReady])

    return (
        <>
            <Head>
                <title>Autoryzacja - BuzkaaClicker.pl</title>
            </Head>

            <main>
                <Center minHeight="100vh">
                    <VStack
                        padding="3rem"
                        background="#0A0A0A"
                        borderRadius="8px"
                    >
                        <Text fontSize="1.5rem">Logowanie</Text>

                        {render(state, redirectToOAuth)}
                    </VStack>
                </Center>
            </main>
        </>
    )
}

const login = (code: string) => api
    .post<Session>("/auth/discord", {
        "code": code,
    })
    .then(response => response.data)


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
            }
        })()
        return (
            <VStack>
                <Text>{translated}</Text>
                {retryLink}
            </VStack>
        )
    } else {
        return (
            <VStack>
                <Text>Wystąpił nieznany błąd: {JSON.stringify(err)}</Text>
                {retryLink}
            </VStack>
        )
    }
}

export default DiscordAuth
