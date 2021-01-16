import * as _ from "lodash";
import React, {useRef} from "react";
import {getCellColor, getFiledSize} from "./utils";
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
                width: getFiledSize({cellSize, gameSize, marginBetweenCell}),
                height: getFiledSize({cellSize, gameSize, marginBetweenCell}),
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
