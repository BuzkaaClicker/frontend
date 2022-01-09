import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from "@chakra-ui/icons";
import {
    Box, Button, ButtonProps, Center, Flex, IconButton, LayoutProps, Link,
    LinkProps,
    Menu, MenuButton, MenuItem, MenuList, SlideFade, Spacer, useDisclosure,
} from "@chakra-ui/react";

type NavItem = {
    title: string;
    href?: string;
    layoutProps?: LayoutProps;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        title: "Statystyki"
    },
    {
        title: "Zalety"
    },
    {
        title: "Funkcje"
    },
    {
        title: "Pobierz"
    },
]


const NavBar = () => (
    <Center>
        <Box width="70%" maxWidth="77.5rem" height="8rem" padding="4rem 0rem 4rem 0rem" zIndex="100">
            <DesktopNavBar />

            <MobileNavBar />
        </Box>
    </Center>
)

const DesktopNavBar = () => (
    <Flex display={{ base: "none", '2xl': "flex" }} alignItems="center">
        <Logo />

        {NAV_ITEMS.map(item => (
            <Link
                key={item.title}
                fontWeight="600"
                color="#aaa"
                marginLeft="3.625rem"
                textTransform="uppercase"
                href={item.href}
            >
                {item.title}
            </Link>
        ))}

        <Spacer />

        <LoginWithDiscord />
    </Flex>
)

const MobileNavBar = () => (
    <Box display={{ base: "flex", '2xl': "none" }} alignItems="center">
        <Menu>
            <MenuButton
                width="2.5rem"
                as={IconButton}
                aria-label='Nawigacja'
                icon={<HamburgerIcon />}
                variant='ghost'
            />
            <MenuList borderWidth="0">
                {NAV_ITEMS.map(item => (<MobileNavBarItem key={item.title} {...item} />))}

                <MobileNavBarItem display={{ base: "flex", md: "none" }} title="Zaloguj się przez Discord" href="#" />
            </MenuList>
        </Menu>

        <Logo
         marginLeft={{ base: "0", md: "1.5rem" }}
         marginRight={{ base: "2.5rem", md: "0" }}
         textAlign="center"
         width={{base: "100%", md: "fit-content"}} />

        <Spacer />

        <LoginWithDiscord display={{ base: "none", md: "flex" }} />
    </Box>
)

const MobileNavBarItem = (props: NavItem & LayoutProps) => (
    <Link color="#aaa" href={props.href} {...props}>
        <MenuItem key={props.title}>
            {props.title}
        </MenuItem>
    </Link>
)

const Logo = (props: LinkProps) => (
    <Link
        width="11rem"
        fontWeight="600"

        isTruncated
        {...props}
    >
        BUZKAACLICKER
    </Link>
)

const LoginWithDiscord = (props: ButtonProps) => (
    <Button variant="discordLogin" marginLeft="3rem" {...props}>
        ZALOGUJ SIĘ PRZEZ DISCORD
    </Button>
)

export default NavBar;
