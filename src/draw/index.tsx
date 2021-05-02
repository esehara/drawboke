import { fabric } from "fabric";
import { useEffect, useState } from "react";

function YouAreArtistCanvas() {
    const TargetCanvasId = "awesome_drawing";

    useEffect(() => {
        const targetCanvas = new fabric.Canvas(TargetCanvasId,{
            isDrawingMode: true,
            height: 500,
            width: 500,
            backgroundColor: "#FFFFFF",
        });
    }, []);

    return (
        <canvas id={TargetCanvasId}></canvas>
    )
}


function SetRandomLabel() {
}

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
        </div>    
    )
}
