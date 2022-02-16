import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Text, HStack, VStack, Button, Spacer, Progress, Menu, MenuButton, IconButton, MenuList, Flex, Link, MenuItem, useToast, UseToastOptions, Tooltip, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogContent, AlertDialogBody, AlertDialogFooter, BoxProps } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import UAParser from 'ua-parser-js'
import { Section } from '../../components/section'
import { ActivityLog } from '../../lib/activitylog'
import { getSession, SessionMeta, useSession } from '../../lib/auth'
import client from '../../lib/client'

const timeFormat = new Intl.RelativeTimeFormat('pl');
const unixSeconds = () => (new Date()).getTime() / 1000;

export const SecurityPanel = () => {
  return (
    <VStack padding={{base: "0", lg: "0 2rem 0 2rem"}}>
      <Sessions />

      <Logs />
    </VStack>
  )
}

// List of sessions.
const Sessions = () => {
  const [sessions, setSessions] = useState<SessionMeta[] | null>()
  let { data, error, mutate } = useSWR<SessionMeta[]>('/sessions', null, {
    refreshInterval: 5000,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })
  useEffect(() => setSessions(data), [data])
  if (error) {
    throw error
  }
  return (
    <Section
      small={true}
      title="Sesje"
      description="Lista Twoich aktywnych sesji"
    >
      <Box>
        <LogoffAllSessions onInvalidate={() => mutate()} />

        {sessions != null ?
          sessions
            .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
            .map((session) =>
              <Session
                key={session.id}
                session={session}
                loggedOff={() => setSessions(sessions.filter(s => s.id != session.id))}
              />)
          :
          <Progress width="14rem" height="0.3rem" marginTop="1rem" isIndeterminate />
        }
      </Box>
    </Section>
  )
}

const LogoffAllSessions = ({ onInvalidate }: { onInvalidate: () => void }) => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const onConfirm = () => {
    setDialogOpen(false)
    sendRequest()
  }
  const onDialogClose = () => setDialogOpen(false)
  const cancelRef = useRef(null)
  const toast = useToast()
  const currentSession = useSession()

  const sendRequest = () => {
    client
      .delete("/sessions/other", { headers: { "Authorization": "Bearer " + currentSession?.accessToken } })
      .then(() => toast({
        title: "Wylogowano pomyślnie.",
        status: "success",
        duration: 3000,
        isClosable: true,
      }))
      .catch(ex => handleLogoffException(ex, toast))
      .then(() => onInvalidate())
  }

  return (
    <>
      <Link
        variant="ghost"
        color="#EC6560"
        fontWeight="600"
        onClick={() => setDialogOpen(true)}
      >
        Wyloguj wszystkie sesje oprócz aktualnej
      </Link>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Wyloguj wszystkie sesje oprócz aktualnej.
            </AlertDialogHeader>

            <AlertDialogBody>
              Jesteś pewny/a? Nie możesz cofnąć tej akcji!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="flat" ref={cancelRef} onClick={onDialogClose}>
                Nie
              </Button>
              <Button variant="flat" backgroundColor="#883522" onClick={onConfirm} ml={3}>
                Tak
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

// Session card.
const Session = ({ session, loggedOff }: { session: SessionMeta, loggedOff: () => void }) => {
  const toast = useToast()
  const currentSession = useSession()

  const [loggingOff, setLoggingOff] = useState(false)
  const logoffSession = (session: SessionMeta) => {
    setLoggingOff(true)

    // if this is current session
    if (session.id == currentSession?.id) {
      // redirect to full page goodbye dialog
      window.location.href = "/auth/logout"
    } else {
      client
        .delete("/session/" + encodeURIComponent(session.id), {
          headers: {
            "Authorization": "Bearer " + getSession()?.accessToken,
          }
        })
        .then(loggedOff)
        .catch(ex => handleLogoffException(ex, toast))
    }
  }

  const [blurActive, setBlurActive] = useState(true)

  const uaParser = UAParser(session.userAgent);
  return (
    <EntryBox marginTop="1rem" disabled={loggingOff}>
      <HStack>
        <VStack align="left">
          <Tooltip label={"Sesja: " + session.id} placement="top" maxW="100%">
            <Text color="white" fontWeight="600" isTruncated>
              {uaParser.browser.name} {uaParser.browser.version}
              &nbsp; • &nbsp;
              {correctOsName(uaParser.os.name)} {uaParser.os.version}
            </Text>
          </Tooltip>

          <HStack>
            <Text color="#aaa" fontWeight="600" userSelect="none">IP:</Text>
            <Blurred active={blurActive} onClick={() => setBlurActive(!blurActive)}>
              <Text color="#aaa" fontWeight="600">{session.ip}</Text>
            </Blurred>
            <Text color="#aaa" fontWeight="600" userSelect="none">•</Text>
            <Activity activeAt={session.lastAccessedAt} current={session.id == currentSession?.id} />
          </HStack>
        </VStack>
        <Spacer />

        <Menu placement="bottom-end">
          <MenuButton
            id="menu_button"
            as={IconButton}
            aria-label='Profil'
            icon={<Text fontSize="1.75rem" fontWeight="900">⋮</Text>}
            variant='ghost'>
          </MenuButton>

          <MenuList borderWidth="0" minW="0" justifyContent="end">
            <MenuItem onClick={() => logoffSession(session)}>
              Wyloguj tę sesję
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </EntryBox>
  )
}

// Toggleable blur wrapper.
const Blurred = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: JSX.Element }) => {
  return (
    <Tooltip label={active ? "Kliknij aby pokazać" : "Kliknij aby ukryć"}>
      <Box
        padding="0"
        margin="0"
        cursor="pointer"
        style={{ filter: active ? "blur(10px)" : undefined }}
        onClick={() => onClick()}
      >
        {children}
      </Box>
    </Tooltip>
  )
}

const handleLogoffException = (ex: Error, toast: (useToast?: UseToastOptions) => void) => {
  console.log("Could not delete session: " + ex + ".")
  toast({
    title: 'Wystąpił nieoczekiwany błąd podczas wylogowywania z sesji.',
    description: ex.message,
    status: 'error',
    duration: 6000,
    isClosable: true,
  })
}

//
// activity logs
//

const Logs = () => {
  const [blurred, setBlurred] = useState(true)
  const [logs, setLogs] = useState<ActivityLog[] | null>()
  let { data, error, mutate, isValidating } = useSWR<ActivityLog[]>('/activities', null, {
    refreshInterval: 0,
  })
  useEffect(() => setLogs(data), [data])

  return (
    <Section
      small={true}
      title="Dziennik zdarzeń"
      description="Lista ostatnich wydarzeń konta"
    >
      {logs == null ?
        <Text>dsadas</Text>
        :
        logs.map(l =>
          <Log key={l.id} info={l}
            blurred={blurred} toggleBlur={() => setBlurred(!blurred)} />
        )
      }
    </Section>
  )
}

const Log = ({ info, blurred, toggleBlur }: { info: ActivityLog, blurred: boolean, toggleBlur: () => void }) => {
  const [expanded, setExpanded] = useState(false)
  const { name, details } = humanLog(info)

  return (
    <Box marginTop="1rem">
      <EntryBox p="0">
        <Button variant="overlay"
          pl="1.563rem"
          width="100%"
          justifyContent="left"
          flexWrap="wrap"
          height="min-content"
          pt="1rem"
          pb="1rem"
          onClick={() => setExpanded(!expanded)}
        >
          <Text fontWeight="800" wordBreak="break-all">{name}</Text>
          <Text color="#aaa" wordBreak="break-all">&nbsp;-&nbsp;</Text>
          <Activity activeAt={info.createdAt} current={false} />

          <Spacer />

          { expanded ? <ChevronUpIcon /> : <ChevronDownIcon /> }
        </Button>
      </EntryBox>

      <EntryBox display={expanded ? "flex" : "none"} m="0">
        <Blurred active={blurred} onClick={() => toggleBlur()}>
          <Text color="#aaa" whiteSpace="pre-line" wordBreak="break-all">{details}</Text>
        </Blurred>
      </EntryBox>
    </Box>
  )
}

const humanLog = (info: ActivityLog) => {
  switch (info.name) {
    case "session_created":
      return {
        name: "Zalogowano do konta",
        details: "Zalogowano do konta z adresu " + info.data.ip + ".\n\n" +
          "Sesja: " + info.data.session_id,
      }
    case "session_changed_user_agent":
      return {
        name: "Zmieniono wersję przeglądarki lub aplikacji",
        details: "Nagłówek UserAgent zmienił się z: \n" + info.data.previous_user_agent + "\nna:\n" +
          info.data.new_user_agent + ".\n\n" +
          "Sesja: " + info.data.session_id,
      }
    case "session_changed_ip":
      return {
        name: "Zmieniono adres IP przypisany do sesji.",
        details: "Adres zmienił się z: " + info.data.previous_ip + " na: " + info.data.new_ip + ".\n\n" +
          "Sesja: " + info.data.session_id,
      }
    default:
      return { name: info.name }
  }
}

//
// shared widgets
//

const EntryBox = ({ disabled, children, ...boxProps }: { disabled?: boolean, children: React.ReactNode } & BoxProps) => {
  return (<Box
    w="100%"
    bgColor="#151517"
    padding="0.75rem 1.563rem 0.75rem 1.563rem"
    opacity={disabled ? "0.5" : "1.0"}
    pointerEvents={disabled ? "none" : "all"}
    {...boxProps}
  >
    {children}
  </Box>)
}

// Last activity time widget.
const Activity = ({ activeAt: activeAt, current }: { activeAt: number, current: boolean }) => {
  const snapshotTimeDiff = () => humanTimeDiff(Math.floor(activeAt - unixSeconds()));
  const [activity, setActivity] = useState<string>(snapshotTimeDiff());

  useEffect(() => {
    if (current) {
      setActivity("Aktualna sesja")
      return undefined
    } else {
      let timerId = setInterval(() => setActivity(snapshotTimeDiff()), 1000)
      return () => clearInterval(timerId)
    }
  }, [current])

  return (
    <Tooltip label={current ? null : (new Date(activeAt * 1000)).toLocaleString("pl")}>
      <Text color={current ? "#94B3FD" : "#aaa"} fontWeight="600" wordBreak="break-all">{activity}</Text>
    </Tooltip>
  )
}

//
// utilities
//

// moze jest to built in moze nie nie wiem nie znalazlem gotowca
const humanTimeDiff = (seconds: number) => {
  const absSeconds = Math.abs(seconds)
  if (absSeconds < 60) {
    return timeFormat.format(seconds, "seconds")
  } else if (absSeconds < 60 * 60) {
    return timeFormat.format(Math.floor(seconds / 60), "minutes")
  } else if (absSeconds < 60 * 60 * 24) {
    return timeFormat.format(Math.floor(seconds / 60 / 60), "hours")
  } else {
    return timeFormat.format(Math.floor(seconds / 60 / 60 / 24), "days")
  }
}

// important fix
// https://github.com/faisalman/ua-parser-js/issues/491
const correctOsName = (osName?: string) => osName == "Mac OS" ? "macOS" : osName
