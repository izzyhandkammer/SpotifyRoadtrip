import {
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Stack,
  Heading,
  Text,
  Link,
  Checkbox,
  Flex,
  useColorModeValue,
  Container
} from '@chakra-ui/react';
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

  const formBackground = useColorModeValue('gray.50', 'gray.700');

  return (
    <Flex align="center" justify="center" h="100vh" bgImage="url('loginBG.png')" bgSize="cover">
      <Box bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)')} p={6} rounded="lg" shadow="md">
        <Heading mb={6}>Log In</Heading>
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
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Field as={Input} id="email" name="email" type="email" variant="outline" />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="outline"
                    validate={(value) => {
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters.';
                      }
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Field
                  as={Checkbox}
                  id="rememberMe"
                  name="rememberMe"
                >
                  Remember Me
                </Field>
                <Button type="submit" colorScheme="blue" size="lg" w="full">
                  Login
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
        <Text align="center" mt={4}>
          Don't have an account? <Link color="blue.500" href="/register">Register here</Link>
        </Text>
        </Box>
    </Flex>
  );
}

export default Login;
