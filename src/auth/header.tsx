import firebase from "firebase/app";
import { Link } from "react-router-dom";
import { GiPencilBrush, GiExitDoor } from "react-icons/gi";
import { ImBubble } from "react-icons/im";
import { Button, Flex, Box, Spacer, Center, VStack } from "@chakra-ui/react";

export function RedirectForSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}  

function UserLogout() { 
    firebase.auth().signOut();
}

function HeaderButtons(props: any) {
    const login_user = props.getCurrentUser();
    return(
        <Center>
            { login_user
            ?   (<Flex>
                    <Spacer />
                    <Link to="/draw/new">
                        <Center mr={6} color="white">
                            <VStack>
                                <Box>
                                    <GiPencilBrush size="4em" />
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
                                <Box><ImBubble size="4em" /></Box>
                                <Box>絵に一言</Box>
                            </VStack>
                        </Center>
                    </Link>
                    <Box onClick={() => { UserLogout(); }}>
                        <Center mr={6} color="white"> 
                            <VStack>
                                <Box>
                                    <GiExitDoor size="4em"/>
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
    const loginUser = props.getCurrentUser();
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
                        <Box fontSize="sm" align="left" color="white">
                            ようこそ
                        </Box>
                        <Box fontSize="lg" align="center">
                            <Link to="/user/esehara">{ loginUser.displayName }</Link>
                        </Box>
                        <Box fontSize="sm" align="right" color="white">
                            さん
                        </Box>
                    </VStack>) }
            <Spacer />
            <HeaderButtons getCurrentUser={() => { return props.getCurrentUser(); }}/>
        </Flex>
    );
}

