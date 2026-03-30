import db, { get, getALL, put, puts, del, getCount } from '@/utils/dexie';
import { dayjs } from '@/utils/day';

export const backgroundService = {
  async getAll({ orderBy = 'createTime', page = 0, pageSize = 10 }) {
    return await getALL('background', orderBy, page * pageSize, pageSize);
  },

  async getById(id) {
    return await get('background', id);
  },

  async save(background) {
    return await put('background', background);
  },

  async saveAll(backgrounds) {
    return await puts('background', backgrounds);
  },

  async remove(id) {
    return await del('background', id);
  },

  async getTotal() {
    return await getCount('background');
  },

  async getVisible() {
    return await db.background.where('visible').equals(1).toArray();
  },

  async getAutoPause() {
    return await db.background.where('autoPause').equals(1).toArray();
  },

  async getByState(state) {
    return await db.background.where('state').equals(state).toArray();
  },

  async updateBackground(id, backgroundData) {
    const background = await this.getById(id);
    if (background) {
      background.source = backgroundData.source;
      background.filename = backgroundData.filename;
      background.updateTime = dayjs().toDate();
      return await this.save(background);
    }
    return null;
  },

  

  async updateState(id, state) {
    const background = await this.getById(id);
    if (background) {
      background.state = state;
      background.updateTime = dayjs().toDate();
      return await this.save(background);
    }
    return null;
  },

  async clear() {
    return await db.background.clear();
  },

  async search(query) {
    return await db.background
      .filter(bg => {
        return bg.filename && bg.filename.toLowerCase().includes(query.toLowerCase());
      })
      .toArray();
  },
};

export default backgroundService;
