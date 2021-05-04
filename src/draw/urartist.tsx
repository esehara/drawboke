import { Stage, Line, Layer } from "react-konva";
import { Box, Button, Checkbox, HStack, useRadio, useRadioGroup} from "@chakra-ui/react"
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



type PosArray = number[];
type lineObjects = [
  ...{
    layer: string,
    isErase: boolean,
    color: string, 
    points:PosArray}[]
];

function DrawingTool(props: any) {
  
  function undoButton() {    
    const lines: lineObjects = props.lines;
    const undoLineStock: lineObjects = props.undoLineStock;

    if (lines.length < 1) { return; }

    props.setLines(lines.slice(0, lines.length - 1));
    props.setUndo(undoLineStock.concat(lines.slice(-1)));

  }

  function redoButton() {
    const lines: lineObjects = props.lines;
    const undoLineStock: lineObjects = props.undoLineStock;

    if (undoLineStock.length < 1) { return; }

    props.setLines(lines.concat(undoLineStock.slice(-1)));
    props.setUndo(undoLineStock.slice(0, undoLineStock.length - 1));
  }


  return (
    <div>
      <Button
        onClick={ () => {
          props.setLines([]);
          props.setUndo([]);
        }} >
        新規
      </Button>
      <Button
        onClick= {() => {
          props.setLines(
            props.lines.filter((line: any) => { return (line.layer != props.selectLayer)}));
        }}>
        レイヤークリア
      </Button>
      <Button 
        isDisabled={props.lines.length < 1}
        onClick={ () => {undoButton(); }}>
        Undo
      </Button>
      <Button
        isDisabled={props.undoLineStock.length < 1}
        onClick={ () => {redoButton(); }}
        >
        Redo
      </Button>
      <Button
        colorScheme="teal"
        variant={props.isUsingErase ? "solid" : "outline" } 
        onClick={() => { props.setUsingErase(!props.isUsingErase); }}>
        消しゴム
      </Button>
    </div>
  );
}
function LinesToLayers(lines: lineObjects, n: number) {
  var result: lineObjects[] = [];
  for (var i = 0; i < n; i++){
    let layerlines = lines.filter((line) => { return (line.layer == i.toString()) });
    result.push(layerlines);
  }
  return result;
}

function LayerSelect(props: any) {
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
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
          borderWidth: "3px",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
      {props.children}
      </Box>
    </Box>
  )
}

function LayerSelecter(props: any) {
  const options = ["Layer1", "Layer2", "Layer3"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "Layer",
    defaultValue: "0",
    onChange: (selectNumber: string) => { 
      props.setSelectLayer(selectNumber); 
    },
  });

  const group = getRootProps();

  return (
  <div>
    レイヤー
    <HStack {...group}>
      {options.map((value, i) => {
        const radio = getRadioProps({ value: i.toString() })
        return (
          <LayerSelect key={i} {...radio}>
            { value } 
          </LayerSelect>
        )
      })}
    </HStack>
  </div>
  )
}

export function YouAreArtistCanvas() {

    const [lines, setLines] = useState<lineObjects>([]);
    const [undoLineStock, setUndo] = useState<lineObjects>([]);
    const [color, setColor] = useState("black");
    const [isUsingErase,setUsingErase] = useState(false);
    const [selectLayer, setSelectLayer] = useState("0");

    const isDrawing = useRef(false);

    function drawStart(e: KonvaEventObject<MouseEvent>) {
      isDrawing.current = true;
      if (undoLineStock.length > 0) { setUndo([]); }
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos != null) {
        const addLine = {
          layer: selectLayer,
          isErase: isUsingErase,
          color: color, 
          points: [pos.x , pos.y]
        }
        setLines([...lines, addLine]);
      }
    }
 
    function drawNow(e: KonvaEventObject<MouseEvent>) {
      if (!isDrawing.current) { return; }
      const point = e.target.getStage()?.getPointerPosition();
      if (point != null) {
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
      }
    }

    function drawEnd(e: KonvaEventObject<MouseEvent>) {
      isDrawing.current = false;
    }

    const layersLines = LinesToLayers(lines ,3);
    console.log(layersLines);

    return (
        <div>
            <DrawingTool 
              lines={lines}
              undoLineStock={undoLineStock}
              isUsingErase={isUsingErase}
              selectLayer={selectLayer}
              setUndo={(value: lineObjects) => {setUndo(value); }}
              setLines={(value: lineObjects) => {setLines(value); }}
              setUsingErase={(value: boolean) => {setUsingErase(value);}} />
            <LayerSelecter setSelectLayer={(value: string) => { setSelectLayer(value); }}/>
            <Stage
              width={600}
              height={600}
              onMouseDown={(e) => { drawStart(e); }}
              onMouseMove={(e) => { drawNow(e); }}
              onMouseUp={(e) => {drawEnd(e);}}
            >
            {layersLines.reverse().map((layerlines, j) => (
              <Layer key={j}>
              {layerlines.map((line, i) => (
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
            ))}
            </Stage>
            <ColorPallete colorChange={(color: string) => { setColor(color); }} />
        </div>
    )
}

