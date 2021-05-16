import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import { useState } from "react"
import { YouAreArtistCanvas } from "./urartist"
import { Box, Button, Heading, VStack } from "@chakra-ui/react"
import { DrawbokeUser } from "../util/db/user"

function TitleForDrawerLabel() {
    const [title, setTitle] = useState("友達がいるのによからぬことをする男")

    function CreateNewLabel()  {
        setTitle("（この絵にお題はありません）")
    }

    function SetRandomLabel() {
        setTitle("違うお題がゲットされるっぽい")
    }

    return (<Box>
            <Box mt={6}>
                <Heading size="2xl" textAlign="center">お題: {title} </Heading>
            </Box>
            <Box align="right">
                <Button onClick={() => CreateNewLabel()}>
                    お題無しで描く
                </Button>
                <Button onClick={() => SetRandomLabel()}>
                    お題を変更する
                </Button>
            </Box>
            </Box>
    )
}
type DrawingProps = {
    user: React.MutableRefObject<DrawbokeUser | null>,
    storage: firebase.storage.Storage,
    db: firebase.firestore.Firestore,
}

export function DrawingPage(props: DrawingProps) {
    return (
        <Box width="80%" m="0 auto">
            <VStack>
                <Box width="100%">
                    <TitleForDrawerLabel />
                </Box>
                <Box>
                    <YouAreArtistCanvas user={props.user} storage={props.storage} db={props.db} />
                </Box>
            </VStack>
        </Box>    
    )
}
