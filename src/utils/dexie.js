import { Dexie } from 'dexie';

const databaseName = import.meta.env.VITE_DB_NAME;
const databaseVersion = import.meta.env.VITE_DB_VERSION;

// 数据库表结构
const tabelStores = {
    config: "++id,timeDisplay,timeFontFamily,timeFontSizeScale,timeFontEffect,timePosition,naiveTheme,country,language,location,createTime,updateTime",
    background: "++id,filename,source,sourcePath,sourceType,useFileSystem,order,fit,hposition,vposition,viewSize,visible,rotate,state,autoPause,volume,muted,maskEnabled,maskFrom,maskTo,createTime,updateTime",
};

export const db = new Dexie(databaseName);
db.version(databaseVersion).stores(tabelStores).upgrade(trans => {
    return trans.config.toCollection().modify(configItem => {
        configItem.timeFontFamily = 'default';
        configItem.timeFontSizeScale = 0;
        configItem.timeFontEffect = 'default';
        configItem.timePosition = 'bottom-center';
    });
});

// 查询一条数据 
export async function get(table, key) {
    return await db[table].get(key);
}

// 查询所有数据
export async function getALL(table, orderBy = "createTime") {
    return await db[table].orderBy(orderBy).reverse().toArray();
}

export async function getByPage(table, orderBy = "createTime", i = 0, n = 10){
    return await db[table].orderBy(orderBy).reverse().offset(i).limit(n).toArray();
}

// 添加或更新 一条数据
export function put(table, object) {
    return db[table].put(object);
}
// 批量添加或更新数据
export function puts(table, array) {
    return db[table].bulkPut(array);
}

// 删除一条数据
export function del(table, key) {
    return db[table].delete(key);
}

export function dels(table, arrayKeys) {
    return db[table].bulkDelete(arrayKeys);
}

// 查询数据个数
export async function getCount(table) {
    return await db[table].count();
}

export async function clear(table) {
    return await db[table].clear();
}

export default {
    get,
    getALL,
    getByPage,
    put,
    puts,
    del,
    dels,
    getCount,
    clear,
}