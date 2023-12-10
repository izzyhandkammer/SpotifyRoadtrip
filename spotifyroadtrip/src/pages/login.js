import { Link,Heading, Text, Container, Box, Flex, VStack, FormLabel, FormControl, Input, FormErrorMessage, Button, Checkbox} from '@chakra-ui/react'
import React from 'react'
import {Formik, Field} from "formik"
import {auth} from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Login(){
   const navigate = useNavigate();
   const signInUser = async(values) =>{
       const {email, password} = values
       signInWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
           // Signed in
           const user = userCredential.user;
           navigate("/dashboard")
           // ...
       })
       .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
       });
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
       onSubmit={signInUser}
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
             <Field
               as={Checkbox}
               id="rememberMe"
               name="rememberMe"
               colorScheme="green"
             >
               Remember me?
             </Field>
             <Button type="submit" colorScheme="green" w="full">
               Login
             </Button>
             <Text>
                 Don't have an account? Sign createUserWithEmailAndPassword{" "}
                 <Link color="green" href="/signup">here</Link>
             </Text>
           </VStack>
         </form>
       )}
     </Formik>
   </Box>
 </Flex>
 )
}


export default Login
