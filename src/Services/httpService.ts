import apiClient from "./apiClient";

class HttpService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async fetchAllRecords() {
    const response = await apiClient.get(`/${this.tableName}`);
    console.log(response);
    return response.data.records;
  }

  async fetchRecord<T>(entity: T) {
    if (!entity) {
      alert("Please enter a valid id");
      return;
    }
    const response = await apiClient.get(`/${this.tableName}/${entity}`);
    return response.data.records;
  }

  async createRecords<T>(entity: T) {
    await apiClient.post(`/${this.tableName}`, {
      fields: entity,
    });
  }

  async updateRecord<T>(entity: T) {
    console.log("update", entity);
    if (!entity.id) {
      alert("Please enter a valid id");
      return;
    }
    const { id, ...fieldsToUpdate } = entity;
    await apiClient.patch(`/${this.tableName}/${id}`, {
      fields: fieldsToUpdate.fields,
    });
  }

  async deleteRecord<T>(entity: T) {
    if (!entity) {
      alert("Please enter a valid id");
      return;
    }
    await apiClient.delete(`/${this.tableName}/${entity}`);
    console.log("Delete success");
  }
}

export default HttpService;
