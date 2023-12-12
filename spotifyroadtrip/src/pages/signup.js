import {
  Button, Input, FormControl, FormLabel, FormErrorMessage, Box, Stack, Heading, useColorModeValue, VStack, Image
} from '@chakra-ui/react';
import React from 'react';
import { Formik, Field } from 'formik';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

function SignUp() {
  const navigate = useNavigate();
  const createUser = async (values) => {
    const { email, password } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is signed up, now add to Firestore
        return setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          // ... any other user data you want to store, like username, profile info, etc.
        });
      })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  

  const formBackground = useColorModeValue('gray.50', 'gray.700');

  return (
    <VStack spacing={8} align="stretch" bgImage="url('loginBG.png')" bgSize="cover" h="100vh">
      <Image src="logo.png" alignSelf="center" boxSize="150px" mt={12} />
      <Box bg={useColorModeValue('rgba(255, 255, 255, 255)', 'rgba(0, 0, 0, 0.8)')} p={6} rounded="lg" shadow="md" alignSelf="center">
        <Heading mb={6}>Sign Up</Heading>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          onSubmit={createUser}
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
                <Button type="submit" colorScheme="blue" size="lg" w="full">
                  Sign Up
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Box>
    </VStack>
  );
}

export default SignUp;
