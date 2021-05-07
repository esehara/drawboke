import firebase from "firebase/app";
import "firebase/auth";
import { Link } from "react-router-dom";
import { Edit, LogOut, MessageCircle } from "react-feather";
import { Button, Flex, Box, Spacer, Center, VStack, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export function RedirectForSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}  

function UserLogout() {
    firebase.auth().signOut();
    const history = useHistory();
    history.go(0);
}

function HeaderButtons(props: any) {
    const currentUser = firebase.auth().currentUser;
    return(
        <Center>
            { currentUser
            ?   (<Flex>
                    <Spacer />
                    <Link to="/draw/new">
                        <Center mr={6} color="white">
                            <VStack>
                                <Box>
                                    <Edit size="4em" />
                                </Box>
                                <Box>
                                    絵を描く
                                </Box>
                            </VStack>
                        </Center>
                    </Link>
                    <Link to="/boke/new">
                        <Center mr={6} color="white">
                            <VStack>
                                <Box><MessageCircle size="4em" /></Box>
                                <Box>絵に一言</Box>
                            </VStack>
                        </Center>
                    </Link>
                    <Box onClick={() => { UserLogout(); }}>
                        <Center mr={6} color="white"> 
                            <VStack>
                                <Box>
                                    <LogOut size="4em"/>
                                </Box>
                                <Box>
                                    ログアウト
                                </Box>
                            </VStack>
                        </Center>
                    </Box>
                </Flex>)

            :   (
                
                        <Button
                            onClick={() => { RedirectForSignIn(); }}
                        > PLAY </Button>
                )
            
            }
        </Center>
    )

}

export function Header(props: any) {
    const loginUser = firebase.auth().currentUser;
    return (
        <Flex 
            as="nav"
            bg="#7ac1b5"
            p={2}
            wrap="wrap"
            w="100%">
            <Box>
                <img src="/src/logo.gif" alt="Logo"/>
            </Box>
            <Spacer />
            {loginUser && 
                    (<VStack>
                        <Box align="left" width="100%">
                            <Text fontSize="xs" align="left" color="white" width="100%">
                                ようこそ
                            </Text>
                        </Box>
                        <Link to="/user/esehara">
                            <Text fontSize="xl" align="center" width="100%">
                                { loginUser.displayName }
                            </Text>
                        </Link>
                        <Box align="right" width="100%">
                            <Text fontSize="xs" color="white">
                                さん
                            </Text>
                        </Box>
                    </VStack>) }
            <Spacer />
            <HeaderButtons />
        </Flex>
    );
}

