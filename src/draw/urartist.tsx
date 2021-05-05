import { Stage, Line, Layer, Rect } from "react-konva";
import { SwatchesPicker } from "react-color";
import { ImFileEmpty, ImBin, ImUndo, ImRedo } from "react-icons/im";
import { BiEraser } from "react-icons/bi";
import { Box, Icon, IconButton, Center, HStack, VStack, useRadio, useRadioGroup } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { KonvaEventObject } from "konva/types/Node";

function PenSize(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  function dotSVGFactory(circleSize: number) {
    return (
      <Icon viewBox="0 0 100 100" boxSize="60px">
        <circle cx="50%" cy="50%" r={circleSize} />
      </Icon> );
    }

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        width="60px"
        height="60px"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
      >
        { dotSVGFactory(parseInt(props.children)) }
      </Box>
    </Box>
  )
}


function PenSizeSelecter(props: any) {
  const options = ["1", "5", "10", "20", "50"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "pencilSize",
    defaultValue: "5",
    onChange: (size) => { props.penSizeSelect(size) },
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <PenSize key={value} {...radio}>
            {value}
          </PenSize>
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
    size: string,
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
    <Box align="center">
      <Box>
      <IconButton
        aria-label="newCanvas"
        icon={<ImBin />}
        onClick={ () => {
          props.setLines([]);
          props.setUndo([]);
        }} >
      </IconButton>
      <IconButton
        icon={<ImFileEmpty />}
        aria-label="newLayer"
        onClick= {() => {
          props.setLines(
            props.lines.filter((line: any) => { return (line.layer != props.selectLayer)}));
        }}>
      </IconButton>
      <IconButton
        icon={<ImUndo />}
        aria-label="undo"
        isDisabled={props.lines.length < 1}
        onClick={ () => {undoButton(); }}>
      </IconButton>
      <IconButton
        icon={<ImRedo />}
        aria-label="redo"
        isDisabled={props.undoLineStock.length < 1}
        onClick={ () => {redoButton(); }}
        >
      </IconButton>
      <IconButton
        icon={<BiEraser />}
        aria-label="eraser"
        colorScheme="teal"
        variant={props.isUsingErase ? "solid" : "outline" } 
        onClick={() => { props.setUsingErase(!props.isUsingErase); }}>
      </IconButton>
      </Box>
    </Box>
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
    <VStack {...group} height="100%">
      {options.map((value, i) => {
        const radio = getRadioProps({ value: i.toString() })
        return (
          <LayerSelect key={i} {...radio}>
            { value } 
          </LayerSelect>
        )
      })}
    </VStack>
  )
}

export function YouAreArtistCanvas() {

    const [lines, setLines] = useState<lineObjects>([]);
    const [undoLineStock, setUndo] = useState<lineObjects>([]);
    const [color, setColor] = useState("#000000");
    const [penSize, setPenSize] = useState("5");
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
          size: penSize,
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
            <HStack>
            <LayerSelecter setSelectLayer={(value: string) => { setSelectLayer(value); }}/>
            <Box>
            <Center>
              <DrawingTool 
                lines={lines}
                undoLineStock={undoLineStock}
                isUsingErase={isUsingErase}
                selectLayer={selectLayer}
                setUndo={(value: lineObjects) => {setUndo(value); }}
                setLines={(value: lineObjects) => {setLines(value); }}
                setUsingErase={(value: boolean) => {setUsingErase(value);}} />

            </Center>            
            <Stage
              width={600}
              height={600}
              onMouseDown={(e) => { drawStart(e); }}
              onMouseMove={(e) => { drawNow(e); }}
              onMouseUp={(e) => {drawEnd(e);}}
            >
              <Layer>
                <Rect fill="white" x={0} y={0} width={600} height={600} />
              </Layer>
            {layersLines.reverse().map((layerlines, j) => (
              <Layer key={j}>
              {layerlines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={ parseInt(line.size, 10) }
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={ line.isErase ? 'destination-out' : 'source-over'}
                />
              ))}
            </Layer>
            ))}
            </Stage>
            </Box>
            <Box>
                <Box mb={6}> 
                  <SwatchesPicker
                  color={color}
                  onChange={(picker) => { setColor(picker.hex) }} />
                </Box>
                <Box>
                  <PenSizeSelecter penSizeSelect={(size: string) => { setPenSize(size); }}/>
                </Box>
            </Box>
            </HStack>
        </div>
    )
}

