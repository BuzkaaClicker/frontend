import React, { ErrorInfo } from "react";
import { FullScreenDialog } from "./dialog";
import { Center, Flex, Link, Text, VStack } from "@chakra-ui/react";

type ErrorBoundaryProps = {
    children?: JSX.Element | JSX.Element[];
}

type ErrorState = {
    errorMessage?: string | JSX.Element;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {}
    }

    static getDerivedStateFromError(error: Error) {
        return { errorMessage: ErrorBoundary.translateErrorMessage(error) };
    }

    static translateErrorMessage(error: Error): string | JSX.Element {
        switch (error.message) {
            case "Network Error": return "Błąd połączenia z serwerem."
            case "Request failed with status code 401": return (<Flex direction="column" alignItems="center">
                <Text>Nie masz dostępu do tej strony będąc niezalogowanym!</Text>
                <Link href="/auth/discord" alignSelf="center">Kliknij tutaj aby przejść do logowania.</Link>
            </Flex>)
            default: return error.message
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log("Uncaught error thrown: " + error + ". Error info: " + errorInfo)
    }

    render() {
        if (this.state.errorMessage) {
            return (
                <FullScreenDialog title="Błąd">
                    <Text>Coś poszło nie tak. Wiadomość błędu:</Text>
                    <Text>{this.state.errorMessage}</Text>
                </FullScreenDialog>
            );
        } else {
            return this.props.children;
        }
    }
}

// idea by David Barral:
// https://medium.com/trabe/catching-asynchronous-errors-in-react-using-error-boundaries-5e8a5fd7b971
// thanks
export const usePromiseError = () => {
    const [_, setError] = React.useState(null);
    return React.useCallback(err => setError(() => { throw err }), [setError]);
};
