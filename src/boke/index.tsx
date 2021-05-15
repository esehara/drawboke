import firebase from "firebase/app";
import "firebase/firestore";
import {VStack, Center, Input, Box, Button} from "@chakra-ui/react";
import {isOkBokeTextLength, addBoke} from "../util/db/boke";
import {useState} from "react";
import {DrawbokeUser} from "../util/db/user";
import {useHistory} from "react-router-dom";

type BokeProps = {
    user: React.MutableRefObject<DrawbokeUser| null>,
    db: firebase.firestore.Firestore
}

export function BokePage(props: BokeProps) {
    const history = useHistory();

    if (props.user.current === null ) {
        history.push("/");
        return (<Box></Box>);
    }

    const [bokeText, setBokeText] = useState("");
    const [sendingBoke, setSendingBoke] = useState(false);

    function sendNewBoke() {
        if (props.user.current === null) { return };
        setSendingBoke(true);
        addBoke(bokeText, props.user.current, props.db)
            .then((boke) => { 
                setSendingBoke(false); 
            });
    }

    return (
    <Center>
        <VStack>
                <Box>
                    <img src="/mock-love-normal.png" />
                </Box>
                <Box>
                    <Input 
                        value={bokeText}
                        onChange={(event) => setBokeText(event.target.value)}
                        isInvalid={!isOkBokeTextLength(bokeText)}
                        size="lg" />
                </Box>
                <Box>
                    <Button 
                        isLoading={sendingBoke} 
                        onClick={() => sendNewBoke()}>
                        投稿
                    </Button>
                </Box>
        </VStack>
    </Center>);
}