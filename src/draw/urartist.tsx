import { Stage, Line, Layer, Rect } from "react-konva";
import { SwatchesPicker } from "react-color";
import { Trash2, CornerUpLeft, CornerUpRight, File, Plus, ChevronsUp } from "react-feather";
import { Box, Icon, IconButton, Center, HStack, VStack, useRadio, useRadioGroup } from "@chakra-ui/react";
import { createIcon } from "@chakra-ui/icon"
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
  const options = ["1", "5", "10", "20", "40"];
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
type lineObject = {
  layer: number,
  isErase: boolean,
  size: string,
  color: string, 
  points:PosArray}

const Eraser = createIcon({
  displayName: "Eraser",
  viewBox: "0 0 24 24",
  d: "M2.586,15.408l4.299,4.299C7.072,19.895,7.326,20,7.592,20h0.001h2h0.4h9.6v-2h-6.958l7.222-7.222 c0.78-0.779,0.78-2.049,0-2.828L14.906,3c-0.779-0.779-2.049-0.779-2.828,0l-4.75,4.749l-4.754,4.843 C1.809,13.371,1.813,14.634,2.586,15.408z M13.492,4.414l4.95,4.95l-2.586,2.586L10.906,7L13.492,4.414z M8.749,9.156l0.743-0.742 l4.95,4.95l-4.557,4.557C9.86,17.946,9.838,17.973,9.816,18H9.593H8.006l-4.005-4.007L8.749,9.156z",
});

type DrawingProp = {
  lines: Array<lineObject>;
  setLines: (a: Array<lineObject>) => void;
  undoLineStock: Array<lineObject>;
  setUndo: (a: Array<lineObject>) => void;
  setUndoCounter: (a: number) => void;
  undoCounter: number;
  isUsingErase: boolean;
  setUsingErase: (a: boolean) => void;
  selectLayer: number;
}
function DrawingTool(props: DrawingProp) {
  
  function undoButton() {    
    if (props.lines.length < 1) { return; }
    if (props.undoCounter < 1) {return; }

    const lines: Array<lineObject> = props.lines;
    const undoLineStock: Array<lineObject> = props.undoLineStock;
  
    props.setLines(lines.slice(0, lines.length - 1));
    props.setUndo(undoLineStock.concat(lines.slice(-1)));
    props.setUndoCounter(props.undoCounter - 1);
  }

  function redoButton() {
    const lines: Array<lineObject> = props.lines;
    const undoLineStock: Array<lineObject> = props.undoLineStock;

    if (undoLineStock.length < 1) { return; }
    
    props.setLines(lines.concat(undoLineStock.slice(-1)));
    props.setUndo(undoLineStock.slice(0, undoLineStock.length - 1));
    props.setUndoCounter(props.undoCounter + 1)
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
          props.setUndoCounter(0);
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
        isDisabled={(props.undoCounter < 1 || props.lines.length < 1 )}
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
        icon={<Eraser w="24px" h="24px" />}
        aria-label="eraser"
        colorScheme="teal"
        variant={props.isUsingErase ? "solid" : "outline" } 
        onClick={() => { props.setUsingErase(!props.isUsingErase); }}>
      </IconButton>
      </Box>
    </Box>
  );
}

const getMaxLayerSize = 
  (lines: Array<lineObject>) => lines.reduce(
    (acc: lineObject, car: lineObject) => acc.layer > car.layer ? acc : car);

function LinesToLayers(lines: Array<lineObject>, layerSize: number): Array<Array<lineObject>> {
  return Array
          .apply(null, Array(layerSize))
          .map((_, i) => lines.filter((line) => line.layer == i));
}

function LayerSelect(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
      <Box as="label">
        <input {...input} />
        <HStack>
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
          <IconButton
            aria-label="layer-plus"
            icon={<Plus />}
            onClick={() => props.addLayer() }>
          </IconButton>
          <IconButton
            isDisabled={props.isDisableMergeLayerButton}
            aria-label="layer-merge"
            icon={<ChevronsUp />}
            onClick={() => { props.mergeLayer() }}>
          </IconButton>)
        </HStack>
      </Box>)
}

interface LayerProps { 
  layerSize: number;
  setLayerSize: (a: number) => void;

  selectLayer: number;
  setSelectLayer: (a: number) => void;

  lines: Array<lineObject>;
  setLines: (a: Array<lineObject>) => void;

  resetUndo: () => void;
}

function LayerController(props: LayerProps) {
  const layerNames: Array<String> = 
    Array.apply(null, Array(props.layerSize))
         .map((_, i) => "Layer" + i.toString());
  
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "Layer",
    value: props.selectLayer,
    onChange: (selectNumber: string) => props.setSelectLayer(parseInt(selectNumber, 10)),
    });

  function addLayer(targetLayer: number, addLayerNumber: number) {
    const changeSelectLayer = targetLayer + addLayerNumber;
    const targetLines = props.lines
      .filter((x) => x.layer >= changeSelectLayer)
      .map((x) => {x.layer = changeSelectLayer + 1; return x });
    const nonTargetLines = props.lines.filter((x) => x.layer < changeSelectLayer);
    if (targetLayer <= props.selectLayer ) {
      props.setSelectLayer(props.selectLayer + 1);
    }
    props.setLines(nonTargetLines.concat(targetLines));
    props.setLayerSize(props.layerSize + addLayerNumber);
    props.resetUndo();
  }

  function mergeLayer(targetLayer: number, addLayerNumber: number) {
    if (targetLayer == 0) { return };
    if (props.layerSize < 2) { return };

    const changeSelectLayer = (targetLayer < 1) ? 0 : (targetLayer + addLayerNumber);
    const targetLines = props.lines
      .filter((x) => x.layer >= targetLayer)
      .map((x) => {x.layer = changeSelectLayer ; return x });
    const nonTargetLines = props.lines.filter((x) => x.layer < targetLayer);
    props.setLines(targetLines.concat(nonTargetLines))
    props.setLayerSize(props.layerSize + addLayerNumber);
    props.resetUndo();

    if (targetLayer <= props.selectLayer) {
      props.setSelectLayer(changeSelectLayer);
    } 
  }

  const group = getRootProps();

  return (
    <Box>
      <IconButton
        aria-label="layer-plus"
        icon={<Plus />}
        onClick={() => addLayer(-1, 1) }>
      </IconButton>
    <VStack {...group} height="100%">
      {layerNames.map((value, i) => {
        const radio = getRadioProps({ value: i });
        return (
          <LayerSelect 
            key={i}
            addLayer={() => addLayer(i, 1) }
            mergeLayer={ () => mergeLayer(i, -1) }
            {...radio}
            isDisableMergeLayerButton={i == 0}
            >
            { value } 
          </LayerSelect>
        )
      })}
    </VStack>
  </Box>)
}

export function YouAreArtistCanvas() {
    const [layerSize, setLayerSize] = useState<number>(3);
    const [lines, setLines] = useState<Array<lineObject>>([]);
    const [undoCounter, setUndoCounter] = useState(0);
    const [undoLineStock, setUndo] = useState<Array<lineObject>>([]);
    const [color, setColor] = useState("#000000");
    const [penSize, setPenSize] = useState("5");
    const [isUsingErase,setUsingErase] = useState(false);
    const [selectLayer, setSelectLayer] = useState(0);
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
        } as lineObject;
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
      setUndoCounter(undoCounter + 1);
      isDrawing.current = false;
    }

    return (
        <div>
            <HStack>
            <LayerController
              lines = { lines }
              resetUndo = {() => { setUndo([]); setUndoCounter(0); }}
              setLines = {(value: Array<lineObject>) => { setLines(value) }}
              selectLayer={ selectLayer }
              setSelectLayer={(value: number) => { setSelectLayer(value); }}
              layerSize={ layerSize }
              setLayerSize={(value: number) => { setLayerSize(value)}} />
            <Box>
            <Center>
              <DrawingTool 
                lines={lines}
                undoLineStock={undoLineStock}
                isUsingErase={isUsingErase}
                selectLayer={selectLayer}
                undoCounter={undoCounter}
                setUndoCounter={(value: number) => setUndoCounter(value)}
                setUndo={(value: Array<lineObject>) => setUndo(value) }
                setLines={(value: Array<lineObject>) => setLines(value) }
                setUsingErase={(value: boolean) => setUsingErase(value) } />

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
            { LinesToLayers(lines, layerSize).reverse().map((layerlines, j) => (
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

