import React, {useCallback, useEffect, useState} from 'react';
import * as _ from 'lodash';
import GameField from "./GameField";
import ToolBar from "./ToolBar";
import History from "./History";
import {createCell, onKeyPressHandler} from "./utils";
import {toolbarHeight} from "./config";

function App() {
    const [prevMoves, setPrevMoves] = useState([]);
    const [cellList, setCellList] = useState([]);

    useEffect(() => {
        if (_.size(cellList) > 0) {
            window.addEventListener('keypress', onKeyPressHandler(cellList, setCellList, prevMoves, setPrevMoves), {once: true});
        }
    }, [cellList]);

    useEffect(() => {
        const list = [];

        list.push(createCell(list))
        list.push(createCell(list))
        setCellList(list);
    }, []);

    const goBack = useCallback(
        () => {
            if (_.size(prevMoves) > 0) {
                const prevCellList = _.first(prevMoves);
                const newPrevMoves = _.takeRight(prevMoves, _.size(prevMoves) - 1);

                window.removeEventListener('keypress', onKeyPressHandler(cellList, setCellList, prevMoves, setPrevMoves));

                setPrevMoves([...newPrevMoves]);
                setCellList([...prevCellList]);
            }
        },
        [prevMoves, cellList],
    )

    return (
        <>
            <ToolBar goBack={goBack}/>
            <div
                style={{
                    display: 'flex',
                }}>
                <div
                    className="App"
                    style={{
                        height: `calc(100vh - ${toolbarHeight}px)`,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <GameField cellList={cellList}/>
                </div>
                <History prevMoves={prevMoves}/>
            </div>
        </>
    );
}

export default App;
