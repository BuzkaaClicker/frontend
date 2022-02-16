import { Center, Flex, Heading, TabList, TabPanel, TabPanels, Tabs, Tab, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import NavBar from '../../components/navbar'
import { SecurityPanel } from './_security'

const SettingsHome: NextPage = () => (
  <>
    <Head>
      <title>Ustawienia - BuzkaaClicker.pl</title>
    </Head>

    <NavBar />

    <main>
      <Center paddingTop="4rem">
        <Tabs variant="unstyled" w="80%" orientation="vertical" width={{base: "95%", lg: "80%"}} maxWidth="77.5rem">
          <Flex direction={{ base: "column", xl: "row" }} width="100%">
            <VStack paddingRight={{ xl: "9.375rem" }}>
              <Heading fontSize="1.5rem" width="100%">Ustawienia</Heading>
              <TabList
                paddingTop={{ xl: "3.43rem" }}
                paddingBottom={{ base: "2.43rem", xl: "0" }}
                width={{ base: "100%", xl: "10rem" }}
              >
                <BTab>Konto</BTab>
                <BTab>Bezpieczeństwo</BTab>
              </TabList>
            </VStack>

            <TabPanels backgroundColor="#24262B">
              <TabPanel>
                <p>kąto</p>
              </TabPanel>
              <TabPanel>
                <SecurityPanel />
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Flex>
        </Tabs>
      </Center>
    </main>
  </>
)

const BTab = ({ children }: { children: string }) =>
  <Tab _selected={{ color: "#94B3FD" }} justifyContent="left" padding="0.375rem 0 0.375rem 0">{children}</Tab>

export default SettingsHome
