import axios from "axios";
import type { TableData } from "./types/types";

const API_BASE_URL = "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs";

export const api = {
  fetchData: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/get`, {
      headers: { "x-auth": token },
    });
    return response.data.data;
  },
  submitRow: async (token: string, row: TableData, isNew: boolean) => {
    const url = isNew ? `${API_BASE_URL}/create` : `${API_BASE_URL}/set/${row.id}`;
    const response = await axios.post(url, row, {
      headers: { "x-auth": token },
    });
    return response.data.data;
  },
  deleteRow: async (token: string, id: string) => {
    await axios.post(`${API_BASE_URL}/delete/${id}`, {}, {
      headers: { "x-auth": token },
    });
  },
};