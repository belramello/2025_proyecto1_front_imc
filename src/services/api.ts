import {
  obtenerToken,
  obtenerRefreshToken,
  guardarToken,
  eliminarTokens,
} from '../utils/storage';

const API_BASE_URL = 'http://localhost:3000';

class Api {
  private isRefreshing = false;

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    console.log("📡 api.ts → request a:", endpoint);

    const controller = new AbortController();
    let accessToken = obtenerToken();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
       
        ...(accessToken && { Authorization: accessToken }),
      },
      signal: controller.signal,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      return await this.handleRefresh(endpoint, config, controller);
    }

    return response;
  }

  private async handleRefresh(endpoint: string, config: RequestInit, controller: AbortController): Promise<Response> {
    console.log("🔁 api.ts → intentando refresh token");

    if (this.isRefreshing) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const retryToken = obtenerToken();
      

      config.headers = {
        ...config.headers,
        ...(retryToken && { Authorization: retryToken }),
      };
      return this.request(endpoint, config);
    }

    this.isRefreshing = true;

    try {
      const refreshToken = obtenerRefreshToken();
      if (!refreshToken) throw new Error('No hay refresh token');

      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await refreshResponse.json().catch(() => null);
      if (!refreshResponse.ok || !data?.accessToken) throw new Error('Refresh falló');

      guardarToken(data.accessToken, data.refreshToken || null);

  
      config.headers = {
        ...config.headers,
        Authorization: data.accessToken,
      };

      controller.abort();
      return this.request(endpoint, config);
    } catch (error) {
      this.logout();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  async post(endpoint: string, body?: any, options?: RequestInit): Promise<any> {
    console.log("📨 api.ts → POST a:", endpoint);

    const response = await this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(`Error ${response.status}`);
      (error as any).response = { status: response.status, data };
      throw error;
    }

    return data;
  }

  async get(endpoint: string, options?: RequestInit): Promise<any> {
    console.log("📥 api.ts → GET a:", endpoint);

    const response = await this.request(endpoint, {
      ...options,
      method: 'GET',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(`Error ${response.status}`);
      (error as any).response = { status: response.status, data };
      throw error;
    }

    return data;
  }

  logout(): void {
        console.log("🚪 api.ts → logout");
        eliminarTokens();
        window.location.href = '/iniciar-sesion';
  }
}

export const api = new Api();