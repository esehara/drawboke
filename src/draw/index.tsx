import { useState } from "react";
import { YouAreArtistCanvas } from "./urartist";
import { Button, Box, VStack } from "@chakra-ui/react";

function TitleForDrawerLabel() {
    const [title, setTitle] = useState("友達がいるのによからぬことをする男");

    function CreateNewLabel()  {
        setTitle("（この絵にお題はありません）");
    }

    function SetRandomLabel() {
        setTitle("違うお題がゲットされるっぽい");
    }

    return (
        <div>
            <h1>お題: {title} </h1>
            <Button
                onClick={() => CreateNewLabel()}
            >新規</Button>
            <Button
                onClick={() => SetRandomLabel()}
            >変更</Button>
        </div>
    )
}

export function DrawingPage() {
    return (
        <Box width="80%" m="0 auto">
            <VStack>
                <Box>
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
