import { Box, Text, HStack, VStack, Button, Spacer, Progress, Menu, MenuButton, IconButton, MenuList, Flex, Link, MenuItem, useToast, UseToastOptions } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import UAParser from 'ua-parser-js'
import { Section } from '../../components/section'
import { ActivityLog } from '../../lib/activitylog'
import { getSession, SessionMeta, useSession } from '../../lib/auth'
import client from '../../lib/client'

export const SecurityPanel = () => {
  return (
    <VStack padding="0 2rem 0 2rem">
      <Sessions />

      <Logs />
    </VStack>
  )
}

const Logs = () => {
  const toast = useToast()
  const [logs, setLogs] = useState<ActivityLog[] | null>()
  let { data, error, mutate, isValidating } = useSWR<ActivityLog[]>('/activities', null)
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
        logs.map(l => <Log key={l.id} info={l} />)
      }
    </Section>
  )
}

const Log = ({ info }: { info: ActivityLog }) => {
  const humanName = ""

  return <Text>{info.name}</Text>
}

const Sessions = () => {
  const toast = useToast()
  const [sessions, setSessions] = useState<SessionMeta[] | null>()
  let { data, error, mutate, isValidating } = useSWR<SessionMeta[]>('/sessions', null)
  useEffect(() => setSessions(data), [data])
  const currentSession = useSession()

  const logoffAllExceptCurrent = () => {
    client
      .delete("/sessions/other", { headers: { "Authorization": "Bearer " + currentSession?.accessToken } })
      .catch(ex => handleLogoffException(ex, toast))
      .then(() => mutate())
  }

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
        <Link
          variant="ghost"
          color="#EC6560"
          fontWeight="600"
          onClick={logoffAllExceptCurrent}
        >
          Wyloguj wszystkie sesje oprócz aktualnej
        </Link>

        {sessions != null && !isValidating ?
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

const sessionTimeFormat = new Intl.RelativeTimeFormat('pl');

const unixSeconds = () => (new Date()).getTime() / 1000;

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

  const uaParser = UAParser(session.userAgent);
  return (
    <Box
      w="25rem"
      bgColor="#151517"
      padding="0.75rem 1.563rem 0.75rem 1.563rem"
      marginTop="1rem"
      opacity={loggingOff ? "0.5" : "1.0"}
      pointerEvents={loggingOff ? "none" : "all"}
    >
      <HStack>
        <VStack align="left">
          <HStack>
            <Text color="white" fontWeight="600" isTruncated>
              {uaParser.browser.name} {uaParser.browser.version}
              &nbsp; • &nbsp;
              {correctOsName(uaParser.os.name)} {uaParser.os.version}
            </Text>
          </HStack>

          <HStack>
            <Text color="#aaa" fontWeight="600">IP: {session.ip}</Text>
            <Text color="#aaa" fontWeight="600">•</Text>
            <SessionActivity session={session} current={session.id == currentSession?.id} />
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
    </Box>
  )
}

const SessionActivity = ({ session, current }: { session: SessionMeta, current: boolean }) => {
  const snapshotTimeDiff = () => humanTimeDiff(Math.floor(session.lastAccessedAt - unixSeconds()));
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
    <Text color={current ? "#94B3FD" : "#aaa"} fontWeight="600">{activity}</Text>
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

// moze jest to built in moze nie nie wiem nie znalazlem gotowca
const humanTimeDiff = (seconds: number) => {
  const absSeconds = Math.abs(seconds)
  if (absSeconds < 60) {
    return sessionTimeFormat.format(seconds, "seconds")
  } else if (absSeconds < 60 * 60) {
    return sessionTimeFormat.format(Math.floor(seconds / 60), "minutes")
  } else if (absSeconds < 60 * 60 * 24) {
    return sessionTimeFormat.format(Math.floor(seconds / 60 / 60), "hours")
  } else {
    return sessionTimeFormat.format(Math.floor(seconds / 60 / 60 / 24), "days")
  }
}

// important fix
// https://github.com/faisalman/ua-parser-js/issues/491
const correctOsName = (osName?: string) => osName == "Mac OS" ? "macOS" : osName

const humanLogName = (name: string) => {
  switch (name) {
    case "created_session":
      return { name: "Zalogowano do konta", details: "Z adresu "}
    default:
      return { name: name }
  }
}
