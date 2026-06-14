type RateLimitEntry = {
  count:number;
  resetAt:number;
};

const attempts = new Map<string,RateLimitEntry>();

function getClientIp(req:Request){
  const forwardedFor =
  req.headers.get("x-forwarded-for");

  if(forwardedFor){
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
  req.headers.get("x-real-ip") ||
  "unknown"
  );
}

export function isRateLimited(
  req:Request,
  scope:string,
  limit:number,
  windowMs:number
){
  const now =
  Date.now();

  const key =
  `${scope}:${getClientIp(req)}`;

  const current =
  attempts.get(key);

  if(!current || current.resetAt <= now){
    attempts.set(key,{
      count:1,
      resetAt:now + windowMs
    });

    return false;
  }

  current.count += 1;

  if(current.count > limit){
    return true;
  }

  attempts.set(key,current);

  return false;
}
