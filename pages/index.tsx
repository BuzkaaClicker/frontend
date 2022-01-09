import * as CSS from "csstype"
import { Box, Button, Flex, Text, Heading, VStack, HStack, Spacer, SimpleGrid, Center, Image } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Icon } from '@iconify/react';
import { Section, SectionCard } from "../components/section";
import ProTag from "../components/pro_tag";
import { Image as NextImage, OutlinedImage } from "../components/image";
import NavBar from "../components/navbar";
import Footer from "../components/footer";
import { BrowserView, isMobile } from "react-device-detect";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Strona Główna - BuzkaaClicker.pl</title>
      <meta name="description" content="Strona główna" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <NavBar />

    <main>
      <Center>
        <VStack spacing={{ base: "4.75rem", lg: "8.75rem" }} maxWidth="68.688rem" margin="0 2rem">
          <Hero />

          <Statistics />

          <Zalets />

          <Features />

          <Downloads />

          <Footer />
        </VStack>
      </Center>
    </main>
  </>
)

// Play hero video background only if page is viewed on desktop computer.
// Do not waste mobile users' transfers.
const HeroVideo = () => {
  if (isMobile) {
    return <Box />
  } else {
    return <video src="fragalnia.mp4" autoPlay muted loop playsInline style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "calc(100vh + 10rem)",
      objectFit: "cover",
    }} />
  }
}

const Hero = () => (
  <Flex
    align="center"
    direction={{ base: "column", xl: "row" }}
    textAlign={{ base: "center", xl: "left" }}
    justifyContent={"center"}
    margin="0 3rem 0 3rem"
    paddingBottom="8rem"
    minHeight="calc(100vh + 1rem)"
  >
    <HeroVideo />
    <Box
      width="100vw"
      height="calc(100vh + 10rem)"
      position="absolute"
      top="0"
      left="0"
      background="linear-gradient(180deg, #151517 -13.41%, rgba(21, 21, 23, 0) 48.57%, #151517 90.98%),
        linear-gradient(0deg, rgba(21, 21, 23, 0.95), rgba(21, 21, 23, 0.95))"
    />
    <Box maxWidth={600} marginBottom={10} zIndex="1">
      <Box marginBottom={5} maxWidth={500} marginRight={{ base: "0", xl: "5rem" }}>
        <Heading fontSize={{ base: "2rem", md: "2.6rem" }}>
          Przyjazny autoclicker,<br />
          tworzony z myślą o tobie
        </Heading>

        <Text variant="secondary" marginTop={2} marginBottom={7}>
          Mega - od zawsze, na zawsze
        </Text>
      </Box>

      <Button width={180}>Zdobądź teraz</Button>
    </Box>

    <Image
      src="/home_cropped.png" alt="Strona Główna BuzkaaClickera"
      width="420px"
      border="1px solid rgba(255, 255, 255, 0.05)"
      boxShadow="10px 10px 0px rgba(255, 255, 255, 0.02)"
      zIndex="10"
      display="block"
    />
  </Flex>
)

const Statistics = () => (
  <VStack
    spacing="2rem"
  >
    <Heading>Statystyki</Heading>

    <Flex
      align="center"
      direction={{ base: "column", md: "row" }}
      textAlign={{ base: "center", md: "left" }}
      justifyContent={"center"}
      margin="3rem"
    >
      <StatisticEntry textColor="#FFB6B6" />
      <StatisticEntry textColor="#B6FFE5" />
      <StatisticEntry textColor="#B6D3FF" />
    </Flex>
  </VStack>
)

type StatisticEntryProps = { textColor: CSS.Property.Color; }

const StatisticEntry: React.FC<StatisticEntryProps> = ({ textColor }) => (
  <Box align="center" m="1rem 3rem">
    <Text fontSize="2.25rem"
      fontWeight={800}
      backgroundImage={"linear-gradient(110deg, " + textColor + ", #FFFFFF)"}
      backgroundClip="text">
      75683
    </Text>
    <Text fontSize="18px" color="#DFDFDF">osób uruchomiło <Text fontWeight={700} color={"#fff"}>BuzkaaClicker</Text> w ostatnich 30 dniach</Text>
  </Box>
);

const Zalets = () => (
  <Section
    title="Zalety, które pokochasz"
    description="Tylko zalety, bo jesteśmy zajebiści."
  >
    <SimpleGrid
      columns={{ base: 1, lg: 2 }}
      spacing={12}
    >
      <ZaletsEntry color="#312323" title="Kąfiguracja" description={"W naszym autoclickerze możesz przypisać " +
        "klawisz na wiele s)posobów. Dodatkowo działa tylko w oknie gry! Koniec z przypadkowymi kliknięciami."} />

      <ZaletsEntry color="#233123" title="Kąfiguracja" description={"W naszym autoclickerze możesz przypisać " +
        "klawisz na wiele sposobów. Dodatkowo działa tylko w oknie gry! Koniec z przypadkowymi kliknięciami."} />

      <ZaletsEntry color="#23202D" title="Kąfiguracja" description={"W naszym autoclickerze możesz przypisać " +
        "klawisz na wiele sposobów. Dodatkowo działa tylko w oknie gry! Koniec z przypadkowymi kliknięciami."} />
    </SimpleGrid>
  </Section>
)

type ZaletsEntryProps = { title: string; description: string; color: CSS.Property.Color; }

const ZaletsEntry: React.FC<ZaletsEntryProps> = ({ title, description, color }) => (
  <Box
    backgroundColor={color}
    padding={{ base: "2rem 2rem", lg: "50px" }}
    borderRadius={"18px"}
    align={"start"}
    justifyContent={"start"}
  >
    <HStack align={"start"}>
      <Icon icon="ant-design:smile-outlined" width="120px" height="50px" />
      <Spacer />
      <VStack align={"start"} marginLeft={"50px"}>
        <Heading fontSize={"2xl"}>{title}</Heading>
        <Text fontSize={"16px"} color={"#AAAAAA"}>{description}</Text>
      </VStack>
    </HStack>
  </Box>
)

const Features = () => (
  <Section
    title="Funkcje"
    description="Scyzoryk, ale do Minecrafta."
  >
    <SectionCard minHeight="18rem">
      <Flex direction={{ base: "column", lg: "row" }}>
        <FeatureButton title="Klikanie" active={true} />
        <FeatureButton title="Konfiguracja" />
        <FeatureButton title="Kopanie" pro={true} />
        <FeatureButton title="Dodatkowa essa" pro={true} />
      </Flex>

      <FeaturePreview />
    </SectionCard>
  </Section>
)

type FeatureButtonProps = {
  title: String;
  active?: boolean;
  pro?: boolean;
};

const FeatureButton = ({ title, active, pro }: FeatureButtonProps) => (
  <Box
    backgroundColor={active ? "#94B3FD" : "transparent"}
    padding="0 1.375rem"
    borderRadius="0.5rem"
    display="flex"
    alignItems="center"
    height="2.75rem"
  >
    <Text fontSize={{ base: "0.9rem", md: 20 }} fontWeight={600}>{title}</Text>
    {pro ? <ProTag marginLeft="1rem" /> : null}
  </Box>
)

const FeaturePreview = () => (
  <Box marginTop={{ base: "1.125rem", lg: "3.125rem" }}>
    <OutlinedImage src="/feature_preview_sample_text.png" width="879px" height="556px" />
  </Box>
)

const Downloads = () => (
  <Section
    title="Pobierz"
    description="Aktualna wersja v2115"
  >
    <Flex
      align="center"
      direction={{ base: "column", lg: "row" }}
      textAlign={{ base: "center", lg: "left" }}
      gap={{ base: "1rem", lg: "5rem" }}
      marginBottom="3.125rem"
    >
      <NextImage src="/download_preview.svg" width="638px" height="368px" />
      <VStack spacing="2rem" alignItems={{ base: "center", lg: "start" }}>
        <DownloadVersion
          title="BuzkaaClicker"
          subtitle="Windows Vista z Service Pack 2 oraz nowsze"
          getText="Pobierz teraz" />
        <DownloadVersion
          title={<DownloadBuzkaaClickerProLogo />}
          subtitle="Wersja premium dla bardziej wymagających"
          getText="kup tera" />
      </VStack>
    </Flex>

    <DownloadTutorial />
  </Section >
)

const DownloadBuzkaaClickerProLogo = () => (
  <Flex justifyContent={{ base: "center", lg: "start" }} alignItems="center" gap="0.6rem">
    <p>BuzkaaClicker</p><ProTag />
  </Flex>
)

type DownloadVersionProps = {
  title: React.ReactNode | String;
  subtitle: String;
  getText: String;
};

const DownloadVersion = ({ title, subtitle, getText }: DownloadVersionProps) => (
  <Box>
    <Heading fontSize={"1.5rem"}>{title}</Heading>
    <Text variant="secondary" marginTop="0.25rem">{subtitle}</Text>
    <Button marginTop="1rem" width="12.75rem">{getText}</Button>
  </Box>
)

const DownloadTutorial = () => (
  <>
    <Heading
      fontSize='1.5rem'
      marginBottom="2rem"
      textAlign={{ base: "center", lg: "start" }}
    >
      Poradnik instalacji w formie filmu
    </Heading>

    <SectionCard minHeight="1rem">
      <NextImage src="/download_tutorial_mock.png" width="999" height="588" />
    </SectionCard>
  </>
)

export default Home

// 12:15
