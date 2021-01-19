import * as _ from "lodash";
import GameField from "./GameField";
import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {gameFieldPadding, toolbarHeight} from "./config";
import {getFiledSize} from "./utils";
import {FixedSizeGrid as Grid} from "react-window";

function History({prevMoves}) {
    const blockRef = useRef(null);
    const [fieldHeight, setFieldHeight] = useState(0);

    const fieldSize = useMemo(() => getFiledSize({cellSize: 20}) + (gameFieldPadding * 2), []);

    useEffect(
        () => {
            setFieldHeight(blockRef?.current?.clientHeight)
            window.addEventListener('resize', () => {
                setFieldHeight(blockRef?.current?.clientHeight)
            });
        },
        []
    );

    return (
        <div
            style={{
                width: getFiledSize({cellSize: 20}) + (gameFieldPadding * 2),
                backgroundColor: 'rgba(185, 173, 162)',
            }}
        >
            <div
                style={{
                    height: 50,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span>History</span>
            </div>

            <div
                ref={blockRef}
                style={{
                    minHeight: `calc(100vh - ${toolbarHeight}px - 3rem)`,
                    maxHeight: `calc(100vh - ${toolbarHeight}px - 3rem)`,
                }}
            >
                <Grid
                    className="Grid"
                    columnCount={1}
                    columnWidth={fieldSize}
                    height={fieldHeight}
                    innerElementType={innerElementType}
                    rowCount={_.size(prevMoves)}
                    rowHeight={fieldSize}
                    width={fieldSize}
                    itemData={{
                        prevMoves,
                    }}
                >
                    {Cell}
                </Grid>
            </div>
        </div>
    );
}

export default History;

const Cell = ({rowIndex, style, data}) => (
    <div
        style={style}
    >
        <GameField
            cellList={_.get(data, `prevMoves.${rowIndex}`)}
            config={{cellSize: 20}}/>
    </div>
);

const innerElementType = forwardRef(({style, ...rest}, ref) => {
    const targetRef = useRef(null);

    return (
        <>
            <div ref={targetRef}/>
            <div
                ref={ref}
                {...rest}
            />
        </>
    )
});
