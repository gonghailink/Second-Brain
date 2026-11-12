/**
 * Hashtags a person meant as tags.
 *
 * `#\w+` also matches issue references — a synced GitHub PR body carrying
 * "#298" and "#5118" arrived as a row tagged with twenty numbers, which is
 * both noise and a filter nobody can use. Pure-numeric hashtags are left in
 * the content, where "#298" reads as the reference it is, and are not
 * extracted. Anything with a letter or underscore is still a tag.
 */
export function extractHashtags(content: string): { cleanContent: string; hashtags: string[] } {
  const isNumeric = (t: string) => /^\d+$/.test(t);
  const matches = content.match(/#\w+/g) ?? [];
  const hashtags = matches.map(t => t.slice(1).toLowerCase()).filter(t => !isNumeric(t));
  const cleanContent = content
    .replace(/#\w+/g, m => (isNumeric(m.slice(1)) ? m : ''))
    .replace(/\s+/g, ' ')
    .trim();
  return { cleanContent, hashtags };
}

/**
 * 大迁都补丁（2026-11-12 总工程师）：update 路径专用的保留换行版。
 * 与 extractHashtags 唯一区别：不把换行压平（横向空白照常归一）。
 * 判例：updateEntryContent 原版会把整篇 markdown 压成一行面条——恢复协议/使用手册等 6 篇曾被压平。
 * capture 主路径仍用压平版（去重与向量口径不变）；本变体只服务 updateEntryContent。
 */
export function extractHashtagsKeepLines(content: string): { cleanContent: string; hashtags: string[] } {
  const isNumeric = (t: string) => /^\d+$/.test(t);
  const matches = content.match(/#\w+/g) ?? [];
  const hashtags = matches.map(t => t.slice(1).toLowerCase()).filter(t => !isNumeric(t));
  const cleanContent = content
    .replace(/#\w+/g, m => (isNumeric(m.slice(1)) ? m : ''))
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?(\r?\n) ?/g, '$1')
    .trim();
  return { cleanContent, hashtags };
}
