import { Heading, Link, SimpleGrid, VStack } from "@chakra-ui/react";

const COLUMNS: ColumnProps[] = [
    {
        title: "BuzkaaClicker",
        links: [
            {
                title: "Zalety",
                href: "/#zalets",
            },
            {
                title: "Funkcje",
                href: "/#features",
            },
            {
                title: "Zdobądź",
                href: "/#getit",
            },
        ],
    },
    {
        title: "Regulaminy",
        links: [
            {
                title: "Polityka prywatności",
                href: "#",
            },
            {
                title: "Regulamin usług",
                href: "#",
            },
        ],
    },
    {
        title: "Kontakt",
        links: [
            {
                title: "Milosz@koczura.pl",
                href: "mailto:Milosz@koczura.pl",
            },
        ],
    },
]

const Footer = () => (
    <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacingY="2rem"
        width="100%"
        paddingBottom="5rem"
    >
        {
            COLUMNS.map(column => (
                <Column {...column} />
            ))
        }
    </SimpleGrid>
)

type ColumnProps = {
    title: string;
    links: FooterLink[];
}

type FooterLink = {
    title: string;
    href: string;
}

const Column = ({ title, links }: ColumnProps) => (
    <VStack alignItems="start">
        <Heading fontSize="1.5rem">{title}</Heading>
        {links.map(link => (
            <Link href={link.href} color="#aaaaaa" fontSize="1.25rem">{link.title}</Link>
        ))}
    </VStack>
)

export default Footer; 
