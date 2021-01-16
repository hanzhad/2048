import * as _ from "lodash";
import GameField from "./GameField";
import React, {useEffect, useRef} from "react";
import {gameFieldPadding, gameSize, marginBetweenCell, toolbarHeight} from "./config";

function History({prevMoves}) {
    const targetRef = useRef(null);
    const blockRef = useRef(null);

    useEffect(
        () => {
            blockRef?.current?.scrollTo(0, targetRef?.current?.offsetTop);
        },
        [prevMoves]
    );


    return (
        <div
            ref={blockRef}
            style={{
                position: 'relative',
                marginTop: toolbarHeight,
                width: 20 * gameSize + (marginBetweenCell * 2 * gameSize) + (gameFieldPadding * 2),
                maxHeight: `calc(100vh - ${toolbarHeight}px)`,
                overflowY: 'auto',
                backgroundColor: 'rgba(185, 173, 162)',
                flexDirection: 'flex-end'
            }}>
            <div style={{height: '3rem'}}/>
            <div
                style={{
                    zIndex: 3,
                    textAlign: "center",
                    position: 'fixed',
                    backgroundColor: 'rgba(185, 173, 162)',
                    width: 20 * gameSize + (marginBetweenCell * 2 * gameSize) + (gameFieldPadding * 2),
                    top: toolbarHeight,
                    right: 0,
                    height: '3rem',
                }}
            >
                <p>History</p>
            </div>
            {
                _.map(
                    prevMoves,
                    (move) => (
                        <div
                            key={JSON.stringify(move)}
                        >
                            <GameField
                                cellList={move}
                                config={{
                                    cellSize: 20,
                                }}/>
                        </div>
                    ))
            }
            <div ref={targetRef}/>
        </div>
    );
}

export default History;
