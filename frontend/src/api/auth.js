import client from "./client";

export const loginUser = (credentials) => client.post("/auth/login", credentials);
export const signupUser = (data) => client.post("/auth/signup", data);
