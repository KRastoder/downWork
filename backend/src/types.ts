export type Role = "freelancer" | "client";

export interface JwtPayload {
  id: number;
  role: Role;
}
