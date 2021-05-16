import {Box, Button, Center, Input, VStack} from "@chakra-ui/react"
import {addBoke, isOkBokeTextLength} from "../util/db/boke"
import {useState} from "react"
import {DrawbokeUser} from "../util/db/user"
import {useHistory} from "react-router-dom"

type BokeProps = {
    user: React.MutableRefObject<DrawbokeUser| null>,
}

export function BokePage(props: BokeProps) {
    const history = useHistory()

    if (props.user.current === null ) {
        history.push("/")
        return (<Box></Box>)
    }

    const [bokeText, setBokeText] = useState("")
    const [sendingBoke, setSendingBoke] = useState(false)

    function sendNewBoke() {
        if (props.user.current === null) { return }
        setSendingBoke(true)
        addBoke(bokeText, props.user.current)
            .then((boke) => { 
                setSendingBoke(false) 
            })
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
    </Center>)
}