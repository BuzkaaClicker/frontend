import { NextPage } from "next"
import Head from "next/head"
import { ReactElement, useEffect, useState } from "react"
import { FullScreenDialog } from "../../components/dialog"
import { logout } from "../../lib/auth"
import { Text } from "@chakra-ui/react"

type State =
    | { type: "dismounted" }
    | { type: "invalidating_session" }
    | { type: "invalidated_session" }
    | { type: "failure", error: any }


const Logout: NextPage = () => {
    const [state, setState] = useState<State>({ type: "dismounted" })

    const tryLogout = () => {
        setState({ type: "invalidating_session" })

        logout()
            .then(_ => setState({ type: "invalidated_session" }))
            .then(_ => setTimeout(() => window.location.href = "/", 2000))
            .catch(err => setState({ type: "failure", error: err }))
    }

    useEffect(() => tryLogout(), [])

    return (
        <>
            <Head>
                <title>Pa :/ - BuzkaaClicker.pl</title>
            </Head>

            <main>
                <FullScreenDialog title="Wylogowywanie">
                    {render(state, tryLogout)}
                </FullScreenDialog>
            </main>
        </>
    )
}

function render(state: State, onReload: () => void): ReactElement {
    switch (state.type) {
        case "invalidating_session":
            return <Text>Niszczenie sesji...</Text>
        case "invalidated_session":
            return <Text>Unieważniono sesję pomyślnie</Text>
        case "failure":
            return <Text>Błąd podczas unieważniania sesji: {state.error?.message}</Text>
        default:
            return <></>
    }
}

export default Logout
