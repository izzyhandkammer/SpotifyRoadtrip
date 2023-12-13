import {
  Button, Input, FormControl, FormLabel, FormErrorMessage, Box, Stack, Heading, useColorModeValue, Flex
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
    const { email, password, name } = values; // Assuming you have a 'name' field in your form values
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is signed up, now add to Firestore
        return setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          name: name, // Save the name to Firestore
          // ... any other user data you want to store
        });
      })
      .then(() => {
        navigate('/dashboard'); // Redirect to dashboard after sign-up
      })
      .catch((error) => {
        alert(error.message); // Show error message if something goes wrong
      });
  };
  

  return (
    <Flex align="center" justify="center" h="100vh" bgImage="url('loginBG.png')" bgSize="cover">
      <Box bg="gray.900" p={8} rounded="lg" shadow="md" w="full" maxW="sm">
        <Heading mb={6} color="white">Sign Up</Heading>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: ''
            }}
            onSubmit={createUser}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email" color="white">Email Address</FormLabel>
                    <Field as={Input} id="email" name="email" type="email" variant="filled" _focus={{ bg: "white", borderColor: "#1DB954" }} />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor="name" color="white">Name</FormLabel>
                    <Field as={Input} id="name" name="name" type="text" variant="filled" _focus={{ bg: "white", borderColor: "#1DB954" }} />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.password && touched.password}>
                    <FormLabel htmlFor="password" color="white">Password</FormLabel>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      variant="filled"
                      _focus={{ bg: "white", borderColor: "#1DB954" }}
                      validate={(value) => {
                        if (value.length < 6) {
                          return 'Password must be at least 6 characters.';
                        }
                      }}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button type="submit" bgColor="#1DB954" color="white" size="lg" w="full">
                    Sign Up
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
      </Box>
    </Flex>
  );
  
  
  
}

export default SignUp;
