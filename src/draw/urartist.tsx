import { Stage, Line, Layer, Rect } from "react-konva";
import { SwatchesPicker } from "react-color";
import { Trash2, CornerUpLeft, CornerUpRight, File } from "react-feather";
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
        icon={<Trash2 />}
        onClick={ () => {
          props.setLines([]);
          props.setUndo([]);
        }} >
      </IconButton>
      <IconButton
        icon={<File />}
        aria-label="newLayer"
        onClick= {() => {
          props.setLines(
            props.lines.filter((line: any) => { return (line.layer != props.selectLayer)}));
        }}>
      </IconButton>
      <IconButton
        icon={<CornerUpLeft />}
        aria-label="undo"
        isDisabled={props.lines.length < 1}
        onClick={ () => {undoButton(); }}>
      </IconButton>
      <IconButton
        icon={<CornerUpRight />}
        aria-label="redo"
        isDisabled={props.undoLineStock.length < 1}
        onClick={ () => {redoButton(); }}
        >
      </IconButton>
      <IconButton
        icon={(
          <Icon width="24" height="24" viewBox="0 0 24 24">
            <path d="M2.586,15.408l4.299,4.299C7.072,19.895,7.326,20,7.592,20h0.001h2h0.4h9.6v-2h-6.958l7.222-7.222 c0.78-0.779,0.78-2.049,0-2.828L14.906,3c-0.779-0.779-2.049-0.779-2.828,0l-4.75,4.749l-4.754,4.843 C1.809,13.371,1.813,14.634,2.586,15.408z M13.492,4.414l4.95,4.95l-2.586,2.586L10.906,7L13.492,4.414z M8.749,9.156l0.743-0.742 l4.95,4.95l-4.557,4.557C9.86,17.946,9.838,17.973,9.816,18H9.593H8.006l-4.005-4.007L8.749,9.156z">
            </path>
          </Icon>)}
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

