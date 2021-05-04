import { Stage, Line, Layer } from "react-konva";
import { Box, Checkbox, HStack, useRadio, useRadioGroup} from "@chakra-ui/react"
import { useRef, useState } from "react";
import { KonvaEventObject } from "konva/types/Node";

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
    onChange: (color) => { props.colorChange(color) },
  });

  const group = getRootProps();

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

function DrawingTool(props: any) {
  const [checkEraseValue, setCheckEraseValue] = useState(false);
  return (
    <div>
      <Checkbox 
        size="lg" 
        colorScheme="orange" 
        isChecked={checkEraseValue}
        onChange={() => {
          const setflag = !checkEraseValue;
          setCheckEraseValue(setflag);
          props.isUsingErase(setflag); 
        }}>
        消しゴム
      </Checkbox>
    </div>
  );
}


type PosArray = number[];
type lineObjects = [
  ...{
    isErase: boolean,
    color: string, 
    points:PosArray}[]
];

export function YouAreArtistCanvas() {

    const [lines, setLines] = useState<lineObjects>([]);

    var color = "black";
    var isUsingErase = false;

    const isDrawing = useRef(false);

    function drawStart(e: KonvaEventObject<MouseEvent>) {
      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos != null) {
        setLines([...lines, {
          isErase: isUsingErase,
          color: color, 
          points: [pos.x , pos.y]
        }]);
      }
    }
 
    function drawNow(e: KonvaEventObject<MouseEvent>) {
      if (!isDrawing.current) { return; }
      const point = e.target.getStage()?.getPointerPosition();
      console.log(lines);
      if (point != null) {
        let lastLine = lines[lines.length - 1];
        console.log(lastLine);
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
      }
    }

    function drawEnd(e: KonvaEventObject<MouseEvent>) {
      isDrawing.current = false;
    }
    
    function colorChange(newColor: string) { color = newColor; };

    return (
        <div>
            <DrawingTool isUsingErase={(prop: boolean) => { isUsingErase = prop;}} />
            <Stage
              width={600}
              height={600}
              onMouseDown={(e) => { drawStart(e); }}
              onMouseMove={(e) => { drawNow(e); }}
              onMouseUp={(e) => {drawEnd(e);}}
            >
              <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={ line.isErase ? 'destination-out' : 'source-over'}
              />
            ))}
              </Layer>
            </Stage>
            <ColorPallete colorChange={(color: string) => { colorChange(color); }} />
        </div>
    )
}

