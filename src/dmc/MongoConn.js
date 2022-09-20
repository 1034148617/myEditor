import axios from 'axios';

// Mongo CURD API
export const url_mongo_read_api = "http://localhost:3000/api/finds";
export const url_mongo_create_api = "http://localhost:3000/api/saves";
export const url_mongo_update_api = "http://localhost:3000/api/updates";
export const url_mongo_delete_api = "http://localhost:3000/api/deletes";

// Editor Data Repository
export const DB = "editor";
export const COL = "documents";

export function SaveDocument(db, col, documents, callback) {
    let data = {
        "db": db,
        "col": col,
        "document": documents
    }
    axios.post(url_mongo_create_api, data).then(function (result) {
        if (callback) callback(result)
    })
}

export function DeleteDocument(db, col, condition, callback) {
    let data = {
        "db": db,
        "col": col,
        "condition": condition
    }
    axios.post(url_mongo_delete_api, data).then(function (result) {
        if (callback) callback(result)
    })
}

export function OpenDocument(db, col, condition, projection, callback) {
    projection = projection || {"_id": 0};
    let data = {
        "db": db,
        "col": col,
        "condition": condition,
        "projection": projection
    }
    axios.post(url_mongo_read_api, data).then(function (result) {
        if (callback) callback(result)
    })
}






