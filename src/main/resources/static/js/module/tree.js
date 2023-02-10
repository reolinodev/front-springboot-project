import Tree from 'tui-tree';

/**
 * setBasicTree : 기본 트리 생성
 * data : 트리 데이터, 콜백함수
 */
export function setBasicTree (data, callback) {

    if(data.length === 0){
        $("#tree").html("-- No Data --");
    }else {

        const tree = new Tree('#tree', {
            data: data,
            nodeDefaultState: 'opened'
        }).enableFeature('Selectable', {
            selectedClassName: 'tui-tree-selected',
        });

        tree.on('select', function(eventData) {
            const nodeData = tree.getNodeData(eventData.nodeId);
            callback(nodeData.target);
        });
        
        return tree;
    }
}

