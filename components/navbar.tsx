import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Box, Button, ButtonProps, Center, Flex, IconButton, LayoutProps, Link,
    LinkProps,
    Menu, MenuButton, MenuItem, MenuList, Spacer,
    Image,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getProfileByUserId, Profile } from "../lib/profile";
import { getSession } from "../lib/auth";
import { usePromiseError } from "./error_boundary";

const LOGIN_DISCORD_URL = "/auth/discord"

type NavItem = {
    title: string;
    href?: string;
    layoutProps?: LayoutProps;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        title: "Statystyki",
        href: "/#statistics",
    },
    {
        title: "Zalety",
        href: "/#zalets",
    },
    {
        title: "Funkcje",
        href: "/#features",
    },
    {
        title: "Pobierz",
        href: "/#getit",
    },
]

const NavBar = () => {
    // if profile -> loaded profile for current session successfully
    // if null -> not logged in
    // if undefined -> page is loading / fetching profile data from api
    const [profile, setProfile] = useState<Profile | null | undefined>(undefined)
    const throwError = usePromiseError()
    useEffect(() => {
        let session = getSession()
        if (session) {
            getProfileByUserId(session.userId)
                .then(setProfile)
                .catch(throwError)
        } else {
            setProfile(null)
        }
    }, [])

    return (
        <Center>
            <Box width="80%" maxWidth="77.5rem" height="8rem" padding="4rem 0rem 4rem 0rem" zIndex="100">
                <DesktopNavBar profile={profile} />

                <MobileNavBar profile={profile} />
            </Box>
        </Center>
    );
}

const DesktopNavBar = ({ profile }: { profile: Profile | null | undefined }) => (
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

        <UserMenu profile={profile} />
    </Flex>
)

const MobileNavBar = ({ profile }: { profile: Profile | null | undefined }) => (
    <Box display={{ base: "flex", '2xl': "none" }} alignItems="center">
        <Menu>
            <MenuButton
                id="menu_button"
                width="2.5rem"
                as={IconButton}
                aria-label='Nawigacja'
                icon={<HamburgerIcon />}
                variant='ghost'
            />
            <MenuList borderWidth="0">
                {NAV_ITEMS.map(item => (<MobileNavBarItem key={item.title} {...item} />))}

                <MobileNavBarItem
                    display={{ base: profile == null ? "flex" : "none", md: "none" }}
                    title="Zaloguj się przez Discord"
                    href={LOGIN_DISCORD_URL} />
            </MenuList>
        </Menu>

        <Logo
            marginLeft={{ base: "0", md: "1.5rem" }}
            marginRight={{ base: "2.5rem", md: "0" }}
            textAlign="center"
            width={{ base: "100%", md: "fit-content" }} />

        <Spacer />

        <UserMenu profile={profile} buttonProps={{
            display: { base: "none", md: "flex" },
        }} />
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
        href="/#"

        isTruncated
        {...props}
    >
        BUZKAACLICKER
    </Link>
)

type MenuProps = {
    profile: Profile | null | undefined
    buttonProps?: ButtonProps
}

const UserMenu = ({ profile, buttonProps }: MenuProps) => {
    if (profile === undefined) {
        return <></>
    } else if (profile === null) {
        return <LoginWithDiscord {...buttonProps} />
    } else {
        return <LoggedInUser profile={profile} />
    }
}

const LoginWithDiscord = (props: ButtonProps) => (
    <Link href={LOGIN_DISCORD_URL}>
        <Button
            variant="userMenu"
            textTransform="uppercase"
            marginLeft="3rem"
            height="2.75rem"
            {...props}
        >
            ZALOGUJ SIĘ PRZEZ DISCORD
        </Button>
    </Link>
)

const LoggedInUser = ({ profile }: { profile: Profile }) => {
    return (
        <Menu placement="bottom-end">
            <MenuButton
                id="menu_button"
                as={IconButton}
                aria-label='Profil'
                icon={
                    <Flex
                        variant="userMenu"
                        height="2.75rem"
                        borderRadius="5"
                        bg="#000"
                        color="#fff"
                        fontWeight="900"
                        padding="0.875rem 1.313rem 0.875rem 1.313rem"
                        alignItems="center"
                    >
                        <Image src={profile.avatarUrl} borderRadius="full" maxW="1.75rem" maxH="1.75rem" />

                        <Text marginLeft="1rem" display={{ base: "none", md: "flex" }}>{profile.name}</Text>
                    </Flex>
                }
                variant='ghost'>
            </MenuButton>

            <MenuList borderWidth="0" minW="0" justifyContent="end">
                <MobileNavBarItem
                    title="Ustawienia"
                    href="/settings"
                />
                <MobileNavBarItem
                    title="Wyloguj się"
                    href="/auth/logout"
                />
            </MenuList>
        </Menu>
    );
}

export default NavBar;
