import * as _ from "lodash";
import defaultConfig, {gameSize} from "./config";

let id = 0;

function getId() {
    return id += 1;
}

export const getCellColor = (value) => {
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
        case 4096:
            return 'rgb(71,128,233)'
        case 8192:
            return 'rgb(10,73,195)'
        case 16384:
            return 'rgb(76,100,150)'
        case 32768:
            return 'rgb(165,193,153)'
        case 65536:
            return 'rgb(86,202,81)'
        case 131072:
            return 'rgb(74,160,55)'
        default:
            return 'rgb(37,159,11)'
    }
}

export const onKeyPressHandler = (cellList, setCellList, prevMoves, setPrevMoves) => ({key}) => {
    let direction;

    switch (key) {
        case 'w': {
            direction = 'top';
            break;
        }
        case 'ц': {
            direction = 'top';
            break;
        }
        case 's': {
            direction = 'bottom';
            break;
        }
        case 'ы': {
            direction = 'bottom';
            break;
        }
        case 'a': {
            direction = 'left';
            break;
        }
        case 'ф': {
            direction = 'left';
            break;
        }
        case 'd': {
            direction = 'right';
            break;
        }
        case 'в': {
            direction = 'right';
            break;
        }
        default: {
            direction = null;
        }
    }

    if (_.isNil(direction)) {
        return setCellList([...cellList]);
    }

    const cellListByDirection = getCellListByDirection(direction, cellList);

    const newList = processMove(direction, cellListByDirection);

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

    setPrevMoves([cellList, ...prevMoves]);
    setCellList([...newList, createCell(newList)]);
};

export const createCell = (list) => {
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
        id: getId(),
    })
}

const checkIsExistsCoordinates = (list, coordinates) => _
    .chain(list)
    .map((i) => _.pick(i, ['y', 'x']))
    .map((i) => _.isEqual(i, coordinates))
    .some((i) => i === true)
    .value();

const processMove = (direction, cellList) => {
    let newList = [];

    _.each(cellList, (list) => {
        let cellArray = [...list];

        let canBeSummed = canSum(cellArray);

        while (canBeSummed === true) {
            sum(cellArray);
            canBeSummed = canSum(cellArray);
        }

        cellArray = move(direction, cellArray);
        newList = [...newList, ...cellArray];

    })

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

const sum = (cellArray) => {
    for (let index = 0; index < _.size(cellArray); index += 1) {
        const currentCell = cellArray[index]
        if (index === gameSize - 1) {
            continue;
        }

        const nextCellIndex = index + 1
        const nextCell = cellArray[nextCellIndex];

        if (_.isNil(nextCell)) {
            continue;
        }

        if (currentCell.value === nextCell.value) {
            const cell = {
                ...currentCell,
                id: getId(),
                value: currentCell.value + nextCell.value,
            }

            cellArray.splice(nextCellIndex, 1)
            cellArray[index] = cell;
        }
    }
}

const move = (direction, cellArray) => {
    const arr = [...cellArray]

    const tryToMove = (cell, currentSell) => {

        if (_.isEqual(cell, currentSell)) {
            return currentSell;
        }

        if (checkIsExistsCoordinates(arr, _.pick(cell, ['y', 'x']))) {
            return tryToMove(
                moveFunctions[direction].calcNextCell(cell),
                currentSell
            )
        }

        return cell;
    }

    _.each(arr, (cell, index) => arr[index] = tryToMove(moveFunctions[direction].getDefaultCell(cell), cell));
    return arr;
}

const getCellListByDirection = (direction, cellList) => {
    const list = {};
    _
        .chain(0)
        .range(gameSize)
        .each((i) => list[i] = moveFunctions[direction].cellListByDirectionProcessor(i, cellList))
        .value();

    return list;
};

const moveFunctions = {
    /*  TOP */
    top: {
        getDefaultCell: (cell) => ({...cell, y: 0}),
        cellListByDirectionProcessor: (x, cellList) => _.chain([...cellList]).filter(['x', x]).sortBy(['y']).value(),
        calcNextCell: (cell) => ({
            ...cell,
            y: cell.y + 1 > gameSize ? cell.y : cell.y + 1,
        }),
    },
    /*  BOTTOM */
    bottom: {
        getDefaultCell: (cell) => ({...cell, y: gameSize - 1}),
        cellListByDirectionProcessor: (x, cellList) => _.chain([...cellList]).filter(['x', x]).sortBy(['y']).reverse().value(),
        calcNextCell: (cell) => ({
            ...cell,
            y: cell.y - 1 < 0 ? cell.y : cell.y - 1,
        }),
    },
    /*  LEFT */
    left: {
        getDefaultCell: (cell) => ({...cell, x: 0}),
        cellListByDirectionProcessor: (y, cellList) => _.chain([...cellList]).filter(['y', y]).sortBy(['x']).value(),
        calcNextCell: (cell) => ({
            ...cell,
            x: cell.x + 1 > gameSize ? cell.x : cell.x + 1,
        }),
    },
    /*  RIGHT */
    right: {
        getDefaultCell: (cell) => ({...cell, x: gameSize - 1}),
        cellListByDirectionProcessor: (y, cellList) => _.chain([...cellList]).filter(['y', y]).sortBy(['x']).reverse().value(),
        calcNextCell: (cell) => ({...cell, x: cell.x - 1 < 0 ? cell.x : cell.x - 1}),
    },
}

export const getFiledSize = (config) => {
    const {cellSize, gameSize, marginBetweenCell} = {
        ...defaultConfig,
        ...config,
    };

    return cellSize * gameSize + (marginBetweenCell * 2 * gameSize);
}
