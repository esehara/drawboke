import { Stage, Line, Layer } from "react-konva";
import { Box, HStack, useRadio, useRadioGroup} from "@chakra-ui/react"
import { useRef, useState } from "react";
import { KonvaEventObject } from "konva/types/Node";
import { GetSet } from "konva/types/types";

function Pallete(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        bg={props.children}
        _checked={{
          borderColor: "teal.600",
          borderWidth: "3px",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
      </Box>
    </Box>
  )
}


function ColorPallete(props: any) {
  const options = ["black", "blue", "red", "yellow", "green", "purple", "white"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "pencilColor",
    defaultValue: "black",
    onChange: (color) => {props.colorChange(color)},
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <Pallete key={value} {...radio}>
            {value}
          </Pallete>
        )
      })}
    </HStack>
  )
}


type lineObject = [
  {points: []}];

  export function YouAreArtistCanvas() {
    const [lines, setLines] = useState<lineObject>([]);
    const isDrawing = useRef(false);

    function drawStart(e: KonvaEventObject<MouseEvent>) {
      isDrawing.current = true;
      const pos = e.target.getStage();
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }

    function drawNow(e: KonvaEventObject<MouseEvent>) {
      if (!isDrawing.current) { return; }
    }

    function drawEnd(e: KonvaEventObject<MouseEvent>) {
      isDrawing.current = false;
    }
    
    return (
        <div>
            <Stage
              onMouseDown={(e) => { drawStart(e); }}
              onMouseMove={(e) => { drawNow(e); }}
              onMouseUp={(e) => {drawEnd(e);}}
            >
              <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#FFFFFF"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
              </Layer>
            </Stage>
            <ColorPallete colorChange={(color: string) => { colorChange(color); }} />
        </div>
    )
}

