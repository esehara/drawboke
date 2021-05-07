import { useState } from "react";
import { YouAreArtistCanvas } from "./urartist";
import { Button, Box, VStack, Heading } from "@chakra-ui/react";

function TitleForDrawerLabel() {
    const [title, setTitle] = useState("友達がいるのによからぬことをする男");

    function CreateNewLabel()  {
        setTitle("（この絵にお題はありません）");
    }

    function SetRandomLabel() {
        setTitle("違うお題がゲットされるっぽい");
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

export function DrawingPage() {
    return (
        <Box width="80%" m="0 auto">
            <VStack>
                <Box width="100%">
                    <TitleForDrawerLabel />
                </Box>
                <Box>
                    <YouAreArtistCanvas />
                </Box>
                <Box>
                    <Button>完成</Button>
                </Box>
            </VStack>
        </Box>    
    )
}
