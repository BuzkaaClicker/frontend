import { Center, VStack, Text } from "@chakra-ui/react"

export type FullScreenDialogProps = {
    title: String;
    children?: JSX.Element | JSX.Element[];
}

export const FullScreenDialog = ({ title, children }: FullScreenDialogProps) => (
    <Center minHeight="100vh">
        <VStack
            padding="3rem"
            margin="2rem"
            background="#0A0A0A"
            borderRadius="8px"
        >
            <Text fontSize="1.5rem">{title}</Text>

            {children}
        </VStack>
    </Center>
)

