import { Link,Heading, Text, Container, Box, Flex, VStack, FormLabel, FormControl, Input, FormErrorMessage, Button, Checkbox} from '@chakra-ui/react'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getUserByEmail } from "firebase/auth";
import {auth} from '../firebase'
import React from 'react'
import { useNavigate } from "react-router-dom";
import {Formik, Field} from "formik"


function SignUp(){
 const navigate = useNavigate();
 const createUser = async(values) =>{
   const {email, password} = values
   createUserWithEmailAndPassword(auth, email, password)
   .then((auth) => {
       if (auth) {
           navigate("/");
       }
   })
   .catch(error => alert(error.message))
};
 return (
   <Flex bg="gray.100" align="center" justify="center" h="100vh">
   <Box bg="white" p={6} rounded="md" w={64}>
     <Formik
       initialValues={{
         email: "",
         password: "",
         rememberMe: false
       }}
       onSubmit={createUser}
     >
       {({ handleSubmit, errors, touched }) => (
         <form onSubmit={handleSubmit}>
           <VStack spacing={4} align="flex-start">
             <FormControl>
               <FormLabel htmlFor="email">Email Address</FormLabel>
               <Field
                 as={Input}
                 id="email"
                 name="email"
                 type="email"
                 variant="filled"
               />
             </FormControl>
             <FormControl isInvalid={!!errors.password && touched.password}>
               <FormLabel htmlFor="password">Password</FormLabel>
               <Field
                 as={Input}
                 id="password"
                 name="password"
                 type="password"
                 variant="filled"
                 validate={(value) => {
                   if (value.length < 6) {
                     return "Password should be over 6 characters.";
                   }
                 }}
               />
               <FormErrorMessage>{errors.password}</FormErrorMessage>
             </FormControl>
             <Button type="submit" colorScheme="blue" w="full">
               Sign Up
             </Button>
           </VStack>
         </form>
       )}
     </Formik>
   </Box>
 </Flex>
 )
}


export default SignUp
