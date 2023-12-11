import React from 'react';
import { Button, Box, Heading, useColorModeValue, Container, Flex, Image } from '@chakra-ui/react';

const AUTH_URL = process.env.REACT_APP_SPOTIFY_AUTH_URL;
const SpotifyIcon = 'spotify_logo.svg'; 

export default function SpotifyLogin() {
  const formBackground = useColorModeValue('gray.50', 'gray.700');

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Container centerContent>
        <Box bg={formBackground} p={6} rounded="lg" shadow="md" maxWidth="sm">
          <Heading mb={6} textAlign="center">Spotify Login</Heading>
          <Button 
            onClick={() => window.location.href = AUTH_URL} 
            colorScheme="green" 
            size="lg"
            w="full"
            leftIcon={<Image src={SpotifyIcon} boxSize="40px" />}
          >
            Login With Spotify
          </Button>
        </Box>
      </Container>
    </Flex>
  );
}