import * as _ from "lodash";
import React, {useRef} from "react";
import {getCellColor} from "./utils";
import defaultConfig from './config';

function GameField({cellList, config = {}}) {
    const gameFieldRef = useRef(null);
    const {gameFieldPadding, cellSize, gameSize, marginBetweenCell} = {
        ...defaultConfig,
        ...config,
    };

    return (
        <div
            ref={gameFieldRef}
            style={{
                position: 'relative',
                backgroundColor: 'rgba(185, 173, 162)',
                padding: gameFieldPadding,
                width: cellSize * gameSize + (marginBetweenCell * 2 * gameSize),
                height: cellSize * gameSize + (marginBetweenCell * 2 * gameSize),
                display: 'flex',
                flexWrap: 'wrap',
                borderRadius: 5,
            }}>
            {_
                .chain(gameSize ** 2)
                .range()
                .map((value) => (
                    <div
                        key={value}
                        style={{
                            margin: marginBetweenCell,
                            width: cellSize,
                            height: cellSize,
                            borderRadius: 3,
                            backgroundColor: 'rgba(203, 198, 181)',
                        }}
                    />
                ))
                .value()
            }
            {_.map(cellList, ({x, y, value, id}) => (
                <div
                    key={id}
                    style={{
                        position: 'absolute',
                        top: gameFieldPadding + ((cellSize + marginBetweenCell * 2) * y),
                        left: gameFieldPadding + ((cellSize + marginBetweenCell * 2) * x),
                        width: cellSize + marginBetweenCell * 2,
                        height: cellSize + marginBetweenCell * 2,
                    }}
                >
                        <span
                            style={{
                                margin: marginBetweenCell,
                                width: cellSize,
                                height: cellSize,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: getCellColor(value),
                            }}>
                            {value}
                        </span>
                </div>
            ))}
        </div>
    )
}

export default GameField;
