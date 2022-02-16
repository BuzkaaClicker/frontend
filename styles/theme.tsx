import { extendTheme } from '@chakra-ui/react'
import { css } from '@emotion/react';

// source https://medium.com/@keeganfamouss/accessibility-on-demand-with-chakra-ui-and-focus-visible-19413b1bc6f9
export const GlobalStyles = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
     outline: none;
     box-shadow: none;
   }
`;

const theme = extendTheme({
  colors: {
    gray: {
      700: "#1a1a1c",
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    Heading: 'Inter',
    body: 'Inter',
  },
  fontWeights: {
    Heading: "800",
  },
  styles: {
    global: {
      body: {
        bg: "#151517",
        color: "white",
      },
    },
  },
  components: {
    MenuList: {
      baseStyle: {
        borderWidth: "0",
      },
    },
    Text: {
      variants: {
        "secondary": {
          color: "#AAAAAA",
          fontSize: { base: "1rem", lg: "1.25rem" },
        }
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: "800",
      },
    },
    Link: {
      baseStyle: {
        color: "#94B3FD",
        transition: "0.35s",
        _hover: {
          transform: "scale(1.01, 1)",
          transformOrigin: "0 0",
          letterSpacing: "1px",
          outline: "0",
          textDecoration: "none",
        },
      },
    },
    Button: {
      variants: {
        "ghost": {
          _focus: {
            boxShadow: "0",
          },
          _hover: {
            transform: "translateY(-0.1em)"
          },
        },
        "overlay": {
          _focus: {
            boxShadow: "0",
            radius: "0",
          },
          _hover: {
            color: "#AAA",
            bg: "#111",
          },
        },
        "primary": {
          bg: "#3970C2",
          borderRadius: "0",
          borderTop: "6px solid #FFFFFF1C",
          borderBottom: "6px solid #0000001C",
          boxShadow: "0px 4px 0px #0000001C",
          fontWeight: "600",
          fontSize: "1.05rem",
          height: "2.938rem",
          _hover: {
            bg: "#25487C",
            color: "#AAA",
            transform: "translateY(-0.1em)"
          },
          _focus: {
            boxShadow: "0px 4px 0px #0000001C",
          },
        },
        "userMenu": {
          borderRadius: "8",
          bg: "#000",
          color: "#fff",
          fontWeight: "900",
          padding: "0.875rem 1.313rem 0.875rem 1.313rem",
          letterSpacing: "-0.05rem",
          _hover: {
            bg: "#222222",
            color: "#AAA",
            transform: "translateY(-0.1em)"
          },
          _focus: {
            boxShadow: "0px 4px 0px #0000001C",
          },
        },
        "flat": {
          borderRadius: "8",
          bg: "#111",
          color: "#fff",
          fontWeight: "900",
          padding: "0.875rem 1.313rem 0.875rem 1.313rem",
          letterSpacing: "-0.05rem",
          _hover: {
            bg: "#222222",
            color: "#AAA",
            transform: "translateY(-0.1em)"
          },
          _focus: {
            boxShadow: "0px 4px 0px #0000001C",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
  },
});

export default theme;
