import { fabric } from "fabric";
import { useEffect } from "react";

export function YouAreArtistCanvas() {
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
