import type { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function forceNonStreaming(
  request: ZuploRequest,
  context: ZuploContext,
): Promise<ZuploRequest | Response> {
  // Only bodies can carry `stream`; skip anything without a JSON body
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return request;
  }

  const body = await request.clone().json();

  if (body?.stream === true) {
    context.log.info(
      `Forcing non-streaming for app ${request.user?.sub ?? "unknown"}`,
    );
    body.stream = false;
    // Drop any stream-only options so providers don't choke
    delete body.stream_options;

    return new ZuploRequest(request, { body: JSON.stringify(body) });
  }

  return request;
}
