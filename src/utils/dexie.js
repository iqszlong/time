import { Dexie } from 'dexie';

const databaseName = import.meta.env.VITE_DB_NAME;
const databaseVersion = import.meta.env.VITE_DB_VERSION;

// 数据库表结构
const tabelStores = {
    config: "++id,autoPause,timeDisplay,naiveTheme,country,language,location,createTime,updateTime",
    background: "++id,filename,source,sourceType,fit,hposition,vposition,visible,state,autoPause,maskEnabled,maskFrom,maskTo,createTime,updateTime",
};

export const db = new Dexie(databaseName);
db.version(databaseVersion).stores(tabelStores);

// 查询一条数据 
export async function get(table, key) {
    return await db[table].get(key);
}

// 查询所有数据
export async function getALL(table,orderBy="createTime", i = 0, n = 10) {
    // 创建时间倒序 (由于没有倒序 自己加个reverse就是倒序)
    // 这里我为了配合分页，加了offset limit 结合起来就是MySql的limit(i,n) 不需要的话也可以直接去掉
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

// 查询数据个数
export async function getCount(table) {
    return await db[table].count();
}

export default {
    get,
    getALL,
    put,
    puts,
    del,
    getCount,
}