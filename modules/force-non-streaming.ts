import type { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function forceNonStreaming(
  request: ZuploRequest,
  context: ZuploContext,
): Promise<ZuploRequest | Response> {
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
    delete body.stream_options;

    return new Request(request, { body: JSON.stringify(body) });
  }

  return request;
}
