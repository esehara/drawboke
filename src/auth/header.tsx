import firebase from "firebase/app";
import { Link } from "react-router-dom";
import { Stack, Button, Flex, Box, Spacer, Center } from "@chakra-ui/react";

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
            ?   (<Box>
                    <Box>
                        <Link to="/user/esehara">{ login_user.displayName }</Link>
                    </Box>
                    <Box>
                        <Link to="/draw/new">絵を描く</Link>
                    </Box>
                    <Box>
                        <Link to="/boke/new">絵に一言</Link>
                    </Box>
                    <Box>
                        <Button
                            onClick={() => { UserLogout(); }} 
                        > Log out </Button>
                    </Box>
                </Box>)

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
        <HeaderButtons getCurrentUser={() => { return props.getCurrentUser(); }}/>
        </Flex>
    );
}

