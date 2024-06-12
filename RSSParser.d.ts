declare module "react-native-rss-parser" {
  export interface RSSItem {
    id?: string;
    title: string;
    published: string;
    links: { url: string }[];
    description: string;
  }

  export interface RSSFeed {
    items: RSSItem[];
  }

  export function parse(xml: string): Promise<RSSFeed>;
}
