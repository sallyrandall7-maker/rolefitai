import crypto from "node:crypto";

const DEFAULT_INVITE_QUOTA = 50;

export async function checkAccessCode(accessCode) {
  const invite = getInvite(accessCode);

  if (!invite.ok) {
    return invite;
  }

  if (invite.unlimited) {
    return {
      ok: true,
      statusCode: 200,
      accessStatus: buildAccessStatus(invite, 0)
    };
  }

  const used = await getUsage(invite.code);

  if (used >= invite.limit) {
    return {
      ok: false,
      statusCode: 403,
      error: "This test code has reached its usage limit. Please ask Sally for a new code.",
      accessStatus: buildAccessStatus(invite, used)
    };
  }

  return {
    ok: true,
    statusCode: 200,
    accessStatus: buildAccessStatus(invite, used)
  };
}

export async function consumeAccessCode(accessCode) {
  const invite = getInvite(accessCode);

  if (!invite.ok) {
    return invite;
  }

  if (invite.unlimited) {
    return {
      ok: true,
      statusCode: 200,
      accessStatus: buildAccessStatus(invite, 0)
    };
  }

  const used = await incrementUsage(invite.code);

  if (used > invite.limit) {
    return {
      ok: false,
      statusCode: 403,
      error: "This test code has reached its usage limit. Please ask Sally for a new code.",
      accessStatus: buildAccessStatus(invite, used)
    };
  }

  return {
    ok: true,
    statusCode: 200,
    accessStatus: buildAccessStatus(invite, used)
  };
}

function getInvite(accessCode) {
  const code = String(accessCode || "").trim();

  if (!code) {
    return {
      ok: false,
      statusCode: 401,
      error: "Please enter an access code before running the AI tools."
    };
  }

  const invites = parseInviteCodes();

  if (!invites.length) {
    return {
      ok: false,
      statusCode: 500,
      error: "Access codes are not configured yet."
    };
  }

  const invite = invites.find((item) => item.code === code);

  if (!invite) {
    return {
      ok: false,
      statusCode: 401,
      error: "Access code not recognised. Please check the code and try again."
    };
  }

  return {
    ok: true,
    statusCode: 200,
    ...invite
  };
}

function parseInviteCodes() {
  const rawCodes = String(process.env.APP_INVITE_CODES || "").trim();
  const defaultQuota = Number(process.env.APP_INVITE_QUOTA || DEFAULT_INVITE_QUOTA);

  if (!rawCodes) {
    return [];
  }

  return rawCodes
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawCode, rawLimit] = entry.split(":");
      const code = rawCode.trim();
      const limitText = String(rawLimit || "").trim().toLowerCase();
      const unlimited = limitText === "unlimited";
      const parsedLimit = Number(limitText || defaultQuota);
      const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : defaultQuota;

      return {
        code,
        limit,
        unlimited
      };
    })
    .filter((invite) => invite.code);
}

function buildAccessStatus(invite, used) {
  if (invite.unlimited) {
    return {
      codeLabel: maskCode(invite.code),
      mode: "owner",
      unlimited: true,
      limit: null,
      used: 0,
      remaining: null,
      message: "Owner access, unlimited calls"
    };
  }

  const safeUsed = Math.max(0, Number(used) || 0);
  const remaining = Math.max(0, invite.limit - safeUsed);

  return {
    codeLabel: maskCode(invite.code),
    mode: "test",
    unlimited: false,
    limit: invite.limit,
    used: safeUsed,
    remaining,
    message: `Test only, ${remaining} calls remaining`
  };
}

async function getUsage(code) {
  const result = await kvCommand("get", usageKey(code));
  const used = Number(result || 0);
  return Number.isFinite(used) ? used : 0;
}

async function incrementUsage(code) {
  const result = await kvCommand("incr", usageKey(code));
  const used = Number(result || 0);
  return Number.isFinite(used) ? used : 0;
}

async function kvCommand(command, key) {
  const config = getKvConfig();
  const response = await fetch(`${config.url}/${command}/${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${config.token}`
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Could not reach the access-code usage store.");
  }

  return data.result;
}

function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("KV_REST_API_URL and KV_REST_API_TOKEN are required for access-code quotas.");
  }

  return {
    url: url.replace(/\/$/, ""),
    token
  };
}

function usageKey(code) {
  const hash = crypto.createHash("sha256").update(code).digest("hex").slice(0, 24);
  return `invite_usage:${hash}`;
}

function maskCode(code) {
  if (code.length <= 4) {
    return "****";
  }

  return `${code.slice(0, 2)}${"*".repeat(Math.max(2, code.length - 4))}${code.slice(-2)}`;
}
