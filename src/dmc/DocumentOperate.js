/**************************************************************************
 * 文档生成预计可能会出现的问题：
 *  -  选择以行节点为最小单位，可额外插入定义好的数据结构（普通文本、各级标题、动态行、表格等，
 *     图片、附件、数据标签等为行内标签无法在生成阶段插入）
 *  -  主要流程为将界面操作选择对应的文档节点或新节点加入节点队列，再根据队列进行后续操作
 *  -  数据和模板分离，数据通过设定参数渲染模板得到，这就导致数据在后台的设定（分组、参数、默
 *     认值、更新Sql)较为复杂
 *  -  
 *
 * 
***************************************************************************/
import {DB, COL, SaveDocument, OpenDocument} from './MongoConn'

/**
 * 文档队列数据结构（用于从已有文档和结构中生成新的文档）
 */
function MyQueue() {
    this.nodes = []         // node rid queue

    // base methods
    MyQueue.prototype.enqueue = (element) => {
        this.nodes.push(element)
    }

    MyQueue.prototype.dequeue = () => {
        return this.nodes.shift()
    }

    MyQueue.prototype.front = () => {
        return this.nodes[0]
    }

    MyQueue.prototype.isEmpty = () => {
        return this.nodes.length === 0
    }

    MyQueue.prototype.size = () => {
        return this.nodes.length
    }
}

export class Document {
    constructor(db = DB, col = COL){
        this.nodes = new MyQueue()
        this.db = db
        this.col = col
    }

    insertNode(DocumentID, Version, RowID){

    }



}






