import React, {useState, useRef, useEffect, useCallback} from 'react';
import * as _ from 'lodash';

const gameSize = 4;
const cellSize = 75;
const marginBetweenCell = 4;
const gameFieldPadding = 10;

function App() {
    const [prevMoves, setPrevMoves] = useState([]);
    const [cellList, setCellList] = useState([]);

    const gameFieldRef = useRef(null);

    useEffect(() => {
        if (_.size(cellList) > 0) {
            window.addEventListener('keypress', move(cellList, setCellList, prevMoves, setPrevMoves), {once: true});
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
                const prevCellList = _.last(prevMoves);
                const newPrevMoves = _.take(prevMoves, _.size(prevMoves) - 1);

                setPrevMoves([...newPrevMoves]);
                setCellList([...prevCellList]);
            }
        },
        [prevMoves, cellList],
    )

    return (
        <>
            <div style={{margin: 24, width: '100%'}}>
                <button onClick={goBack}>Go back</button>
            </div>
            <div
                className="App"
                style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
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
                        .map(() => (
                            <div style={{
                                margin: marginBetweenCell,
                                width: cellSize,
                                height: cellSize,
                                borderRadius: 3,
                                backgroundColor: 'rgba(203, 198, 181)',
                            }}/>
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
            </div>
        </>
    );
}

export default App;

function createCell(list) {
    const cellList = [...list];

    const generateCoordinates = () => {
        const randCoordinates = {
            y: _.random(0, gameSize - 1),
            x: _.random(0, gameSize - 1),
        };


        if (checkIsExistsCoordinates(cellList, randCoordinates)) {
            return generateCoordinates();
        }

        return randCoordinates;
    }

    const generateValue = () => {
        if (_.size(cellList) === 0) {
            return 2;
        }

        return _.random() === 0 ? 2 : 4;
    }

    return ({
        ...generateCoordinates(),
        value: generateValue(),
        id: new Date().getTime(),
    })
}

function getCellColor(value) {
    switch (value) {
        case 2:
            return 'rgb(238, 228, 218)'
        case 4:
            return 'rgb(237, 224, 200)'
        case 8:
            return 'rgb(242, 177, 121)'
        case 16:
            return 'rgb(245, 149, 99)'
        case 32:
            return 'rgb(246, 124, 95)'
        case 64:
            return 'rgb(246, 94, 59)'
        case 128:
            return 'rgb(237, 207, 114)'
        case 256:
            return 'rgb(237, 204, 97)'
        case 512:
            return 'rgb(237, 200, 80)'
        case 1024:
            return 'rgb(237, 197, 63)'
        case 2048:
            return 'rgb(237, 194, 46)'
    }
}

const move = (cellList, setCellList, prevMoves, setPrevMoves) => ({key}) => {
    if (key !== 'w' && key !== 's' && key !== 'a' && key !== 'd') {
        return setCellList([...cellList]);
    }

    const newList = moveFunctions[key].getNewList(key, cellList);

    if (
        _.difference(newList, cellList)?.length === 0 &&
        _.difference(cellList, newList)?.length === 0
    ) {
        return setCellList(newList);
    }

    if (_.size(newList) === gameSize ** 2) {
        alert('gg wp!')
        return;
    }

    setPrevMoves([...prevMoves, cellList]);
    setCellList([...newList, createCell([...newList])]);
};

const checkIsExistsCoordinates = (list, coordinates) => _
    .chain(list)
    .map((i) => _.pick(i, ['y', 'x']))
    .map((i) => _.isEqual(i, coordinates))
    .some((i) => i === true)
    .value();

const processMove = (key, cellList) => {
    let newList = [];
    _
        .chain(cellList)
        .each((list) => {
            let cellArray = [...list];

            let canBeSummed = canSum(cellArray);

            while (canBeSummed === true) {
                sum(cellArray);
                canBeSummed = canSum(cellArray);
            }

            cellArray = moveFunctions[key].move(cellArray);
            newList = [...newList, ...cellArray];

        })
        .value();

    return newList;
}

const canSum = (cellArray) => {
    const arr = [];

    _.each(cellArray, (currentCell, index, list) => {

        if (index === gameSize - 1) {
            return;
        }

        const nextCellIndex = index + 1
        const nextCell = list[nextCellIndex];

        if (_.isNil(nextCell)) {
            return;
        }

        if (currentCell.value === nextCell.value) {
            arr.push(true);
        } else {
            arr.push(false)
        }
    })

    return _.some(arr, (x) => x === true);
};
const sum = (cellArray) => _.each(cellArray, (currentCell, index, list) => {
    if (index === gameSize - 1) {
        return;
    }

    const nextCellIndex = index + 1
    const nextCell = list[nextCellIndex];

    if (_.isNil(nextCell)) {
        return;
    }

    if (currentCell.value === nextCell.value) {
        currentCell.value += nextCell.value;
        cellArray.splice(nextCellIndex, 1)
    }
});

const moveFunctions = {
    /*  TOP */
    w: {
        getNewList: (key, cellList) => {
            const listOfX = {};
            _
                .chain(0)
                .range(gameSize)
                .each((x) => listOfX[x] = [..._.chain([...cellList]).filter(['x', x]).sortBy(['y']).value()])
                .value();

            return processMove(key, listOfX);

        },
        move: (cellArray) => {
            const arr = [...cellArray]

            const tryToMove = (cell, currentSell) => {

                if (_.isEqual(cell, currentSell)) {
                    return currentSell;
                }

                if (checkIsExistsCoordinates(arr, _.pick(cell, ['y', 'x']))) {
                    return tryToMove(
                        {
                            ...cell,
                            y: cell.y + 1 > gameSize ? cell.y : cell.y + 1,
                        },
                        currentSell
                    )
                }

                return cell;
            }

            _.each(arr, (cell, index) => arr[index] = tryToMove({...cell, y: 0}, cell))

            return arr;
        }
    },
    /*  BOTTOM */
    s: {
        getNewList: (key, cellList) => {
            const listOfX = {};
            _
                .chain(0)
                .range(gameSize)
                .each((x) => listOfX[x] = [..._.chain([...cellList]).filter(['x', x]).sortBy(['y']).reverse().value()])
                .value();

            return processMove(key, listOfX);

        },
        move: (cellArray) => {
            const arr = [...cellArray]

            const tryToMove = (cell, currentSell) => {

                if (_.isEqual(cell, currentSell)) {
                    return currentSell;
                }

                if (checkIsExistsCoordinates(arr, _.pick(cell, ['y', 'x']))) {
                    return tryToMove(
                        {
                            ...cell,
                            y: cell.y - 1 < 0 ? cell.y : cell.y - 1,
                        },
                        currentSell
                    )
                }

                return cell;
            }

            _.each(arr, (cell, index) => arr[index] = tryToMove({...cell, y: gameSize - 1}, cell))

            return arr;
        }
    },
    /*  LEFT */
    a: {
        getNewList: (key, cellList) => {
            const listOfY = {};
            _
                .chain(0)
                .range(gameSize)
                .each((y) => listOfY[y] = [..._.chain([...cellList]).filter(['y', y]).sortBy(['x']).value()])
                .value();

            return processMove(key, listOfY);
        },
        move: (cellArray) => {
            const arr = [...cellArray]

            const tryToMove = (cell, currentSell) => {

                if (_.isEqual(cell, currentSell)) {
                    return currentSell;
                }

                if (checkIsExistsCoordinates(arr, _.pick(cell, ['y', 'x']))) {
                    return tryToMove(
                        {
                            ...cell,
                            x: cell.x + 1 > gameSize ? cell.x : cell.x + 1,
                        },
                        currentSell
                    )
                }

                return cell;
            }

            _.each(arr, (cell, index) => arr[index] = tryToMove({...cell, x: 0}, cell))
            return arr;
        }
    },
    /*  RIGHT */
    d: {
        getNewList: (key, cellList) => {
            const listOfY = {};
            _
                .chain(0)
                .range(gameSize)
                .each((y) => listOfY[y] = [..._.chain([...cellList]).filter(['y', y]).sortBy(['x']).reverse().value()])
                .value();

            return processMove(key, listOfY);
        },
        move: (cellArray) => {
            const arr = [...cellArray]

            const tryToMove = (cell, currentSell) => {

                if (_.isEqual(cell, currentSell)) {
                    return currentSell;
                }

                if (checkIsExistsCoordinates(arr, _.pick(cell, ['y', 'x']))) {
                    return tryToMove(
                        {
                            ...cell,
                            x: cell.x - 1 < 0 ? cell.x : cell.x - 1,
                        },
                        currentSell
                    )
                }

                return cell;
            }

            _.each(arr, (cell, index) => arr[index] = tryToMove({...cell, x: gameSize - 1}, cell))
            return arr;
        }
    },
}
