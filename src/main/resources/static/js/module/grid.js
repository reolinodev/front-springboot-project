import Grid from 'tui-grid';

/**
 * setBasicGrid : 기본 그리드 생성
 * columns: 컬럼, gridData : 데이터
 */
export function setBasicGrid(columns, gridData) {
    const grid = new Grid({
        el: document.getElementById('grid'),
        data: gridData,
        scrollX: false,
        scrollY: false,
        columns,
        columnOptions: {
            resizable: true,
        },
    });

    Grid.applyTheme('striped');

    grid.resetData(gridData);

    return grid;
}

/**
 * setBasicGridId : 기본 그리드 생성
 * columns: 컬럼, gridData : 데이터, gridId : 그리드 아이디
 */
export function setBasicGridId(columns, gridData, gridId) {
    const grid = new Grid({
        el: document.getElementById(`${gridId}`),
        data: gridData,
        scrollX: false,
        scrollY: false,
        columns,
        columnOptions: {
            resizable: true,
        },
    });

    Grid.applyTheme('striped');

    grid.resetData(gridData);

    return grid;
}

/**
 * setCheckBoxGrid : 체크박스가 있는 그리드 생성(해당 아이디에 생성)
 * columns: 컬럼, gridData : 데이터
 */
export function setCheckBoxGridId(columns, gridData, gridId) {
    const grid = new Grid({
        el: document.getElementById(`${gridId}`),
        rowHeaders: ['checkbox'],
        data: gridData,
        scrollX: false,
        scrollY: false,
        columns,
        columnOptions: {
            resizable: true,
        },
    });

    Grid.applyTheme('striped');

    grid.resetData(gridData);

    return grid;
}

/**
 * setCheckBoxGrid : 체크박스가 있는 그리드 생성
 * columns: 컬럼, gridData : 데이터
 */
export function setCheckBoxGrid(columns, gridData) {
    const grid = new Grid({
        el: document.getElementById('grid'),
        rowHeaders: ['checkbox'],
        data: gridData,
        scrollX: false,
        scrollY: false,
        columns,
        columnOptions: {
            resizable: true,
        },
    });

    Grid.applyTheme('striped');

    grid.resetData(gridData);

    return grid;
}

/**
 * setGridClickEvent : 그리드 클릭 이벤트
 * grid: 그리드, select_column : 선택할 컬럼, return_column: 반환할 컬럼, callbackFunc: 콜백
 */
export function setGridClickEvent(
    grid,
    selectColumn,
    returnColumn,
    callbackFunc
) {
    grid.on('focusChange', ev => {
        if (ev.columnName === selectColumn) {
            callbackFunc(grid.getValue(ev.rowKey, returnColumn));
        }
    });
}

/**
 * getCheckedRows : 그리드 클릭 이벤트
 * grid: 그리드
 */
export function getCheckedRows(grid) {
    return grid.getCheckedRows();
}

/**
 * setGridClickRowEvent : 그리드 클릭 이벤트
 * grid: 그리드, select_column : 선택할 컬럼,  callbackFunc: 콜백
 */
export function setGridClickRowEvent(grid, selectColumn, callbackFunc) {
    grid.on('focusChange', ev => {
        if (ev.columnName === selectColumn) {
            callbackFunc(grid.getRow(ev.rowKey));
        }
    });
}

/**
 * focustGridFirstRow : 그리드 클릭 이벤트
 * grid: 그리드
 */
export function focustGridFirstRow(grid) {
    grid.focusAt(0, 0);
}
