import { fabric } from "fabric";
import { useEffect } from "react";

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

function TitleForDrawerLabel() {
    return (
        <h1>お題: 友達がいるのによからぬことをする男</h1>
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
