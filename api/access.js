import { checkAccessCode } from "../server/inviteAccess.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const accessCheck = await checkAccessCode(request.body?.accessCode);

    response.status(accessCheck.statusCode).json({
      ok: accessCheck.ok,
      error: accessCheck.error,
      accessStatus: accessCheck.accessStatus
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Something went wrong while checking the access code."
    });
  }
}
