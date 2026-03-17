import { handleApiRequest } from "./_lib/czechfarmApi.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request, response) {
  return handleApiRequest(request, response);
}
