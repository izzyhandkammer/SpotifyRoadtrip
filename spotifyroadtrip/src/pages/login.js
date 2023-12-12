import { Button, Input, FormControl, FormLabel, FormErrorMessage, Box, Stack, Heading, Text, Link, Checkbox, Flex, useColorModeValue, Container } from '@chakra-ui/react';
import React from 'react';
import { Formik, Field } from 'formik';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const signInUser = async (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate('/dashboard');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <Flex align="center" justify="center" h="100vh" bgImage="url('loginBG.png')" bgSize="cover">
      <Box bg="gray.900" p={9} rounded="lg" shadow="md">
        <Heading mb={6} color="white">Log In</Heading>
        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberMe: false
          }}
          onSubmit={signInUser}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.email && touched.email}>
                  <FormLabel htmlFor="email" color="white">Email Address</FormLabel>
                  <Field as={Input} id="email" name="email" type="email" variant="filled" _placeholder={{ color: 'gray.500' }} _focus={{ bg: 'white', borderColor: 'green.500' }}/>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password" color="white">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    _placeholder={{ color: 'gray.500' }}
                    _focus={{ bg: 'white', borderColor: 'green.500' }}
                    validate={(value) => {
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters.';
                      }
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Checkbox id="rememberMe" name="rememberMe" colorScheme="green">
                  <Text as="span" color="white">Remember Me</Text>
                </Checkbox>
                <Button type="submit" bgColor="#1DB954" color="white" size="lg" w="full">
                  Login
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
        <Text align="center" mt={4} color="white">
          New to Spotify Roadtrip? <Link color="#1DB954" href="/signup"> Sign up here</Link>
        </Text>
      </Box>
    </Flex>
  );
  
}

export default Login;
