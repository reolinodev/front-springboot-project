import Pagination from 'tui-pagination';

export default class Page {
    // 현재페이지, 페이징 초기화, 페이지별 항목수, 총 카운트
    constructor(page, pageInit, size, totalCount) {
        this.page = page;
        this.pageInit = pageInit;
        this.size = size;
        this.totalCount = totalCount;
    }
}

/**
 * setPagination : 페이징 세팅
 */
export function setPagination(page, callBackFunc) {
    const pagination = new Pagination('pagination', {
        totalItems: page.totalCount,
        itemsPerPage: page.size,
        visiblePages: 10,
    });

    pagination.on('afterMove', eventData => {
        callBackFunc(eventData.page);
    });

    return pagination;
}
