import { redirect } from "next/navigation";
export type Role="user"|"moderator"|"admin";
export async function getCurrentUserRole():Promise<Role>{return "admin";}
export async function requireModeratorOrAdmin(){const role=await getCurrentUserRole();if(role==="user") redirect("/unauthorized");return role;}
