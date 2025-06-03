import type { User, UrlItem } from "../types";
import axios from "axios";
const API = "http://localhost:3000";
const SHORT_URL_DOMAIN = "https://sho.rt";
// Mock data for demonstration purposes

// const MOCK_USERS: User[] = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'john@example.com',
//     avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
//   },
// ];

// const MOCK_URLS: UrlItem[] = [
//   {
//     id: "1",
//     originalUrl:
//       "https://www.example.com/very/long/url/that/needs/shortening/for/better/sharing/experience",
//     shortUrl: "https://sho.rt/abc123",
//     clicks: 42,
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: "2",
//     originalUrl:
//       "https://www.anotherexample.com/path/to/resource?param=value&another=param",
//     shortUrl: "https://sho.rt/def456",
//     clicks: 17,
//     createdAt: new Date(Date.now() - 86400000).toISOString(),
//   },
// ];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      console.log("touching in auth service");
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      console.log(access_token, " access token");

      console.log(response.data, "response data");

      localStorage.setItem("token", access_token);

      const userResponse = await axios.get(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      return userResponse.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    }
  },

  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    await delay(1000);

    const response = await axios.post(`${API}/auth/register`, {
      name,
      email,
      password,
    });

    return response.data;
  },
};

export const urlService = {
  fetchUserUrls: async (): Promise<UrlItem[]> => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API}/url/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data, "response data");

    return response.data.map((url: any) => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortCode,
      clicks: url.clicks || 0,
      createdAt: url.createdAt,
    }));
  },

  createShortUrl: async (originalUrl: string): Promise<UrlItem> => {
    const token = localStorage.getItem("token");

    // Normalize the URL to ensure it's valid (default to http)
    const validUrl = /^https?:\/\//.test(originalUrl)
      ? originalUrl
      : `http://${originalUrl}`;

    try {
      const { data } = await axios.post(
        `${API}/url/shorten`,
        { originalUrl: validUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data, "data");


      return {
        id: data._id,
        originalUrl: data.originalUrl,
        shortUrl: data.shortCode,
        clicks: data.clicks || 0,
        createdAt: data.createdAt,
      };
    } catch (error: any) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Request Error:", error.message);
      }
      throw new Error("Failed to shorten URL");
    }
  },

deleteUrl: async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");

  await axios.delete(`${API}/url/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
},

  incrementClicks: async (id: string): Promise<void> => {
    // await delay(300);
    // const url = MOCK_URLS.find((url) => url.id === id);
    // if (url) {
    //   url.clicks += 1;
    // }
  },
};
