import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  faqItems,
  notices,
  politicianItems,
  resourceItems,
  timelineItems,
} from "../lib/public-data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function run() {
  const newsPath = path.join(process.cwd(), "data/news.json");
  const newsArticles = JSON.parse(await fs.readFile(newsPath, "utf8"));

  await supabase.from("news_articles").upsert(newsArticles);

  await supabase
    .from("notices")
    .upsert(notices.map(({ title, content, is_pinned }) => ({ title, content, is_pinned })));

  await supabase.from("timeline_items").upsert(timelineItems);

  await supabase.from("faq_items").upsert(faqItems);

  await supabase.from("politicians").upsert(politicianItems);

  await supabase.from("resources").upsert(
    resourceItems.map((item) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      file_url: item.file_url || item.source_url,
      source_url: item.source_url,
      file_type: item.file_type,
      file_size: 0,
      published_date: item.published_date,
    })),
  );

  console.log("Seed completed with source-based public datasets.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
