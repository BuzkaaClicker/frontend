import { Box, Center, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import NavBar from '../../components/navbar'

const SettingsHome: NextPage = () => (
  <>
    <Head>
      <title>Ustawienia - BuzkaaClicker.pl</title>
    </Head>

    <NavBar />

    <main>
      <Center>
        <Tabs variant="unstyled" w="80%" orientation="vertical">
          <Flex direction={{ base: "column", sm: "row" }} width="100%">
            <TabList width={{ base: "100%", sm: "10rem" }} borderLeft={{ base: "0", sm: "0.1rem solid #fafafa" }}>
              <Tab>Ustawienia</Tab>
              <Tab>Bezpieczeństwo</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>My kontra oni!</p>
                <p>kim sa oni!</p>
                <p>one!</p>
                <p>one!</p>
                <p>My kontra oni!</p>
                <p>kim sa oni!</p>
                <p>one!</p>
                <p>one!</p>
                <p>My kontra oni!</p>
                <p>kim sa oni!</p>
                <p>one!</p>
                <p>one!</p>
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

export default SettingsHome
