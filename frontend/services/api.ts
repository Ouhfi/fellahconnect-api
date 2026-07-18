import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:3000/api`;
  }
  return "http://192.168.0.103:3000/api";
};

const BASE_URL = getBaseUrl();

let tokenMem = "";

/**
 * Storage helper for saving user token.
 * Uses localStorage on web and in-memory fallback on mobile to avoid dependencies.
 */
export const storage = {
  async setToken(token: string) {
    tokenMem = token;
    if (Platform.OS === "web") {
      try {
        localStorage.setItem("token", token);
      } catch (e) {
        console.warn("localStorage not available", e);
      }
    }
  },

  async getToken(): Promise<string> {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem("token") || tokenMem;
      } catch (e) {
        return tokenMem;
      }
    }
    return tokenMem;
  },

  async removeToken() {
    tokenMem = "";
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem("token");
      } catch (e) {
        console.warn("localStorage not available", e);
      }
    }
  },
};

/**
 * API client exposing backend operations.
 */
export const api = {
  /**
   * Helper function to wrap fetch with content headers and authorization
   */
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await storage.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Une erreur est survenue.");
    }

    return result.data;
  },

  /**
   * Login user and save token
   */
  async login(email: string, password: string) {
    const data = await this.fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data && data.token) {
      await storage.setToken(data.token);
    }
    return data;
  },

  /**
   * Register user (farmer profile)
   */
  async register(userData: any) {
    return this.fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        role: "farmer",
      }),
    });
  },

  /**
   * Send chat message to AI assistant
   */
  async chat(prompt: string, history: any[] = []) {
    return this.fetchWithAuth("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ prompt, history }),
    });
  },

  /**
   * Get current user details
   */
  async getMe() {
    return this.fetchWithAuth("/auth/me");
  },

  /**
   * Add a new land plot
   */
  async addLandPlot(landData: {
    name: string;
    area: number;
    location: string;
    soilType: "Clay" | "Sandy" | "Loamy" | "Rocky";
  }) {
    return this.fetchWithAuth("/land-plots", {
      method: "POST",
      body: JSON.stringify(landData),
    });
  },

  /**
   * List all land plots of authenticated farmer
   */
  async getLandPlots() {
    return this.fetchWithAuth("/land-plots");
  },
};
