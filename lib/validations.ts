import { z } from "zod";
const htmlTagRegex=/<[^>]*>?/gm;export const sanitizeText=(v:string)=>v.replace(htmlTagRegex,"").trim();
export const newsSchema=z.object({title:z.string().min(2).max(120).transform(sanitizeText),source_name:z.string().min(2).max(80).transform(sanitizeText),summary:z.string().min(10).max(1000).transform(sanitizeText),source_url:z.string().url(),category:z.string().min(1).max(40).transform(sanitizeText),published_date:z.string()});
