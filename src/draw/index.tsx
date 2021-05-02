import { useEffect, useState } from "react";
import { YouAreArtistCanvas } from "./urartist";

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
            <button
                onClick={() => CreateNewLabel()}
            >新規</button>
            <button
                onClick={() => SetRandomLabel()}
            >変更</button>
        </div>
    )
}

export function DrawingPage() {
    return (
        <div>
            <TitleForDrawerLabel />
            <YouAreArtistCanvas />
            <button>完成</button>
        </div>    
    )
}
