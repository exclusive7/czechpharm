import {
  processContactQueue,
  verifyCronRequest,
} from "../_lib/czechfarmApi.js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(request, response) {
  if (!verifyCronRequest(request)) {
    response.statusCode = 401;
    response.end("Unauthorized");
    return;
  }

  try {
    const result = await processContactQueue();

    response.writeHead(200, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        ok: true,
        ...result,
      })
    );
  } catch (error) {
    response.writeHead(500, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        ok: false,
        message: error?.message || "Failed to process contact queue.",
      })
    );
  }
}
