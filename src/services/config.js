import { get, getALL, put, puts, del, getCount,clear } from '@/utils/dexie';
import { dayjs } from '@/utils/day';

export const configService = {
  async getAll({orderBy = 'createTime', page = 0, pageSize = 10}) {
    return await getALL('config', orderBy, page * pageSize, pageSize);
  },

  async getById(id) {
    return await get('config', id);
  },


  async save(config) {
    return await put('config', config);
  },

  async saveAll(configs) {
    return await puts('config', configs);
  },

  async remove(id) {
    return await del('config', id);
  },

  async getTotal() {
    return await getCount('config');
  },

  async updateTimeDisplay(id, value) {
    const config = await this.getById(id);
    if (config) {
      config.timeDisplay = value;
      config.updateTime = dayjs().toDate();
      return await this.save(config);
    }
    return null;
  },

  async updateNaiveTheme(id, value) {
    const config = await this.getById(id);
    if (config) {
      config.naiveTheme = value;
      config.updateTime = dayjs().toDate();
      return await this.save(config);
    }
    return null;
  },

  async updateCountry(id, value) {
    const config = await this.getById(id);
    if (config) {
      config.country = value;
      config.updateTime = dayjs().toDate();
      return await this.save(config);
    }
    return null;
  },

  async updateLanguage(id, value) {
    const config = await this.getById(id);
    if (config) {
      config.language = value;
      config.updateTime = dayjs().toDate();
      return await this.save(config);
    }
    return null;
  },

  async updateLocation(id, value) {
    const config = await this.getById(id);
    if (config) {
      config.location = value;
      config.updateTime = dayjs().toDate();
      return await this.save(config);
    }
    return null;
  },

  async clear() {
    return await clear('config');
  },
};

export default configService