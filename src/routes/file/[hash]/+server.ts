import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, platform }) => {
  const { hash } = params;

  if (!hash) {
    throw error(400, "Missing hash parameter");
  }

  const object = await platform?.env.BUCKET.get(hash);

  if (!object) {
    throw error(404, "File not found");
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    object.httpMetadata?.contentType || "application/octet-stream",
  );
  headers.set("Content-Length", object.size.toString());
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, {
    status: 200,
    headers,
  });
};
