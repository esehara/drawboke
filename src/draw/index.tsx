import { useEffect, useState } from "react";
import { YouAreArtistCanvas } from "./urartist";
import { Button } from "@chakra-ui/react";

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
        <div>
            <TitleForDrawerLabel />
            <YouAreArtistCanvas />
            <Button>完成</Button>
        </div>    
    )
}
