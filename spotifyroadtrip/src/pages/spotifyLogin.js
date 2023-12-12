import React from 'react';
import { Button, Box, Heading, useColorModeValue, Container, Flex, Image } from '@chakra-ui/react';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=82535259faeb4f5d898c5ed51fb8398b&response_type=code&redirect_uri=http://localhost:3000/dashboard&scope=playlist-modify-public"
const SpotifyIcon = 'spotify_logo.svg'; 

export default function SpotifyLogin() {
  const formBackground = useColorModeValue('gray.50', 'gray.700');

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgImage="url('loginBG.png')"
      bgSize="cover"
    >
      <Container centerContent>
        <Box bg="gray.900" p={6} rounded="lg" shadow="md" maxWidth="sm">
          <Heading mb={6} textAlign="center" color="white">Spotify Login</Heading>
          <Button
            onClick={() => window.location.href = AUTH_URL}
            bgColor="#1DB954"
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